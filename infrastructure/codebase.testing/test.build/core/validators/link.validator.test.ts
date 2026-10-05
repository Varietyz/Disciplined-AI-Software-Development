import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closureFindings, lookbackFindings } from "@banes-lab/build-scripts/core/validators/link.validator.ts";
import { dirname, join } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const SITE = "https://example.test";
let root = "";

const put = function put(file: string, value: unknown): void {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeVerbatim(join(root, file), typeof value === "string" ? value : JSON.stringify(value));
};

const edge = function edge(ref: string, json: string): object {
    return { json: SITE + json, ref };
};

const group = function group(relation: string, ...links: readonly object[]): object {
    return { links, relation };
};

const SECTION = "chapter:/p#s";
const RECORD = "architecture:x";
const SOURCE = "anatomy:f";
const SOURCE_JSON = "/json/source/web/f";
const OTHER_RECORD = "architecture:y";
const CLOSURE_FILE = "closure.json";
const RECORD_FILE = "json/records/architecture/x.json";

beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "link-"));
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("closureFindings", () => {
    it("accepts an empty closure report", () => {
        put(CLOSURE_FILE, "[]");
        expect(closureFindings(join(root, CLOSURE_FILE))).toStrictEqual([]);
    });

    it("reports each unresolved link against the leaf that named it, or its target", () => {
        put(CLOSURE_FILE, [
            { from: null, label: "Gone", target: "architecture:gone" },
            { from: "/pag/guide", label: "/pag/guide#gone", target: "/pag/guide#gone" },
        ]);
        expect(closureFindings(join(root, CLOSURE_FILE)).map((finding) => finding.file)).toStrictEqual([
            "architecture:gone",
            "/pag/guide",
        ]);
    });

    it("reports a build that wrote no closure report", () => {
        expect(closureFindings(join(root, CLOSURE_FILE))).toHaveLength(1);
    });
});

describe("lookbackFindings", () => {
    it("accepts leaves whose every forward edge has its reverse", () => {
        put("json/p/s.json", {
            ref: SECTION,
            relations: [
                group("evidence", edge(SOURCE, SOURCE_JSON)),
                group("links-to", edge(RECORD, "/json/records/architecture/x")),
            ],
        });
        put(RECORD_FILE, {
            collection: "architecture",
            ref: RECORD,
            relations: [group("evidence", edge(SOURCE, SOURCE_JSON)), group("linked-from", edge(SECTION, "/json/p/s"))],
        });
        put("json/source/web/f.json", {
            ref: SOURCE,
            relations: [
                group("evidence-for", edge(SECTION, "/json/p/s"), edge(RECORD, "/json/records/architecture/x")),
            ],
        });
        expect(lookbackFindings(root, SITE, new Set())).toStrictEqual([]);
    });

    it("reports a linked record with no evidence unless it is declared absent, and a record that is both", () => {
        put(RECORD_FILE, {
            collection: "architecture",
            ref: RECORD,
            relations: [group("linked-from", edge(SECTION, "/json/p/s"))],
        });
        put("json/records/architecture/y.json", { collection: "architecture", ref: OTHER_RECORD, relations: [] });
        expect(lookbackFindings(root, SITE, new Set()).map((finding) => finding.file)).toStrictEqual([RECORD_FILE]);
        expect(lookbackFindings(root, SITE, new Set([RECORD]))).toStrictEqual([]);
        put(RECORD_FILE, {
            collection: "architecture",
            ref: RECORD,
            relations: [group("evidence", edge(SOURCE, SOURCE_JSON))],
        });
        expect(lookbackFindings(root, SITE, new Set([RECORD])).map((finding) => finding.message)).toStrictEqual([
            "This record is in both EVIDENCE and EVIDENCE_ABSENT.",
        ]);
    });

    it("asks no evidence of a record linked only from the page that lists every record", () => {
        put(RECORD_FILE, {
            collection: "architecture",
            ref: RECORD,
            relations: [group("linked-from", edge("chapter:/ontology#x", "/json/ontology/principles/x"))],
        });
        expect(lookbackFindings(root, SITE, new Set())).toStrictEqual([]);
    });

    it("reports a link and an evidence edge whose target does not point back", () => {
        put("json/p/s.json", {
            ref: SECTION,
            relations: [
                group("evidence", edge(SOURCE, SOURCE_JSON)),
                group("links-to", edge(RECORD, "/json/records/architecture/x")),
            ],
        });
        put(RECORD_FILE, { ref: RECORD, relations: [] });
        put("json/source/web/f.json", { ref: SOURCE, relations: [] });
        const messages = lookbackFindings(root, SITE, new Set()).map((finding) => `${finding.file} ${finding.message}`);
        expect(messages).toHaveLength(2);
        expect(messages[0]).toContain(`json/p/s.json This page links to ${RECORD}`);
        expect(messages[1]).toContain(`json/p/s.json This page cites ${SOURCE} as evidence`);
    });

    it("reports a source file whose used file does not list it as a user, and accepts it once it does", () => {
        const used = "json/source/web/g.json";
        put("json/source/web/f.json", {
            ref: SOURCE,
            relations: [group("uses", edge("anatomy:g", "/json/source/web/g"))],
        });
        put(used, { ref: "anatomy:g", relations: [] });
        const findings = lookbackFindings(root, SITE, new Set());
        expect(findings.map((finding) => finding.file)).toStrictEqual(["json/source/web/f.json"]);
        expect(findings[0]?.message).toContain("anatomy:g");
        put(used, { ref: "anatomy:g", relations: [group("used-by", edge(SOURCE, SOURCE_JSON))] });
        expect(lookbackFindings(root, SITE, new Set())).toStrictEqual([]);
    });

    it("reports a record relation visible from one end only, and accepts it once the target lists it back", () => {
        const other = "json/records/architecture/y.json";
        put(RECORD_FILE, {
            ref: RECORD,
            relations: [{ links: [edge(OTHER_RECORD, "/json/records/architecture/y")], relation: "principles" }],
        });
        put(other, { ref: OTHER_RECORD, relations: [] });
        const findings = lookbackFindings(root, SITE, new Set());
        expect(findings.map((finding) => finding.file)).toStrictEqual([RECORD_FILE]);
        expect(findings[0]?.message).toContain(OTHER_RECORD);
        put(other, {
            ref: OTHER_RECORD,
            relations: [{ links: [edge(RECORD, "/json/records/architecture/x")], relation: "principle-of" }],
        });
        expect(lookbackFindings(root, SITE, new Set())).toStrictEqual([]);
    });

    it("leaves an edge to an unpublished target to the closure check", () => {
        put("json/p/s.json", {
            ref: SECTION,
            relations: [group("links-to", edge(RECORD, "/json/records/architecture/gone"))],
        });
        expect(lookbackFindings(root, SITE, new Set())).toStrictEqual([]);
    });
});
