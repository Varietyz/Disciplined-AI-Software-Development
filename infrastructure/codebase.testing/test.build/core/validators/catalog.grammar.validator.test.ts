import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
    catalogFiles,
    grammarFindings,
    literalFindings,
    markdownFormFindings,
    slugFindings,
} from "@banes-lab/build-scripts/core/validators/catalog.grammar.validator.ts";
import { dirname, join } from "node:path";
import { driftedLiteral, markdownMissing } from "@banes-lab/build-scripts/configuration/strings/catalog.strings.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { writeCanonicalText, writeVerbatim } from "@govlab/canonical-write";
import { GRAMMAR } from "@banes-lab/build-scripts/core/converters/catalog.grammar.converter.ts";
import { tmpdir } from "node:os";

let root = "";

const put = async function put(file: string, text: string): Promise<void> {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    await writeCanonicalText(join(root, file), text);
};

const putText = function putText(file: string, text: string): void {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeVerbatim(join(root, file), text);
};

beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "grammar-"));
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("catalogFiles", () => {
    it("lists the catalog's JSON files and source texts, and leaves out the route payloads and everything else", async () => {
        await put("json/api.json", "{}\n");
        await put("json/faq.json", "{}\n");
        await put("api.md", "# Api\n");
        putText("source/web/core/x.ts.txt", "export const x = 1;\n");
        putText("robots.txt", "User-agent: *\n");
        expect(catalogFiles(root, new Set(["json/faq.json"]))).toStrictEqual({
            json: ["json/api.json"],
            text: ["source/web/core/x.ts.txt"],
        });
    });
});

describe("grammarFindings", () => {
    it("reports a JSON file no grammar row matches, and every template row the catalog shows no example of", () => {
        const findings = grammarFindings({ json: ["json/api.json", "json/a/b/c/d/e.json"], text: [] });
        expect(findings[0]?.message).toBe(
            "The catalog publishes /json/a/b/c/d/e, which matches no row of the address grammar.",
        );
        const templates = GRAMMAR.filter((row) => row.address.json.includes("{"));
        expect(findings).toHaveLength(1 + templates.length);
    });

    it("takes a published source text as the example of the source text row", () => {
        const withText = grammarFindings({ json: [], text: ["source/web/core/x.ts.txt"] });
        const withoutText = grammarFindings({ json: [], text: [] });
        expect(withText).toHaveLength(withoutText.length - 1);
        expect(withText.some((finding) => finding.file.endsWith("{path}.txt"))).toBe(false);
    });
});

describe("markdownFormFindings", () => {
    it("reports a JSON address kind with no Markdown form, exempts the plain text kind, and passes the real grammar", () => {
        const planted = [
            { address: { json: "/json/api/planted", markdown: null }, kind: "query" as const },
            { address: { json: "/source/{tree}/{path}.txt", markdown: null }, kind: "text" as const },
        ];
        expect(markdownFormFindings(planted).map((finding) => finding.file)).toStrictEqual(["/json/api/planted"]);
        expect(markdownFormFindings()).toStrictEqual([]);
    });
});

describe("slugFindings", () => {
    it("reports a name lookup key the published slug rules would not produce", async () => {
        await put(
            "json/api/slugs/d.json",
            JSON.stringify({ slugs: { "Dual Write": ["x"], "dual-write": ["y"], "dual-writes": ["z"] } }),
        );
        expect(slugFindings(root, ["json/api/slugs/d.json"]).map((finding) => finding.message)).toStrictEqual([
            "The name lookup holds the key Dual Write, which the published slug rules would not produce.",
            "The name lookup holds the key dual-writes, which the published slug rules would not produce.",
        ]);
    });
});

describe("literalFindings", () => {
    it("accepts the site file that carries the declared answer text, and reports one that drifted", () => {
        const file = join(root, "site.conf");
        writeVerbatim(file, `return 404 '${markdownMissing("https://x.test")}\\n';\n`);
        expect(literalFindings("https://x.test", file)).toStrictEqual([]);
        expect(literalFindings("https://other.test", file)).toStrictEqual([{ file, message: driftedLiteral(file) }]);
    });

    it("finds the declared answer text in the real site file", () => {
        expect(literalFindings("https://banes-lab.com")).toStrictEqual([]);
    });
});
