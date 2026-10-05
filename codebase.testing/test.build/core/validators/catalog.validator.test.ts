import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { digestOf, fingerprintOf } from "@govlab/content-fingerprint";
import { dirname, join } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { Buffer } from "node:buffer";
import { CATALOG_FILE_BUDGET } from "@banes-lab/build-scripts/configuration/constants/catalog.constants.ts";
import { catalogFindings } from "@banes-lab/build-scripts/core/validators/catalog.validator.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const SITE = "https://example.test";
const A_FILE = "json/records/architecture/a.json";
const COLUMNS = ["ref", "kind", "title", "json", "markdown", "bytes", "fingerprint"];
let root = "";

const put = function put(file: string, text: string): void {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeVerbatim(join(root, file), text);
};

const row = function row(ref: string, json: string, text: string, markdown: string | null): readonly unknown[] {
    return [
        ref,
        "record",
        ref,
        SITE + json,
        markdown === null ? null : SITE + markdown,
        Buffer.byteLength(text),
        digestOf(text),
    ];
};

const leafA = function leafA(text: string, markdown: string | null): readonly unknown[] {
    return row("architecture:a", "/json/records/architecture/a", text, markdown);
};

const LEAF = JSON.stringify({ relations: [`${SITE}/json/records/architecture/b`, `${SITE}/pag#anchor`] });
const OTHER = JSON.stringify({ ref: "architecture:b" });

const sitemap = function sitemap(files: readonly string[]): string {
    return files.map((file) => `<url><loc>${SITE}/${file}</loc></url>`).join("\n");
};

const plant = function plant(rows: readonly (readonly unknown[])[], markdown: readonly string[]): void {
    put("json/api.json", "{}");
    put("api.md", "# Site\n");
    put("json/api/resolve.json", "{}");
    put(
        "json/api/ids.json",
        JSON.stringify({
            shards: [{ count: rows.length, group: "architecture", json: `${SITE}/json/api/ids/architecture` }],
        }),
    );
    put("json/api/ids/architecture.json", JSON.stringify({ columns: COLUMNS, rows }));
    put("sitemap-catalog.xml", sitemap(["api.md", ...markdown]));
};

beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "catalog-"));
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("catalogFindings", () => {
    it("accepts a tree whose every listed leaf exists with its recorded size and names only served addresses", () => {
        put(A_FILE, LEAF);
        put("records/architecture/a.md", "# A\n");
        put("json/records/architecture/b.json", OTHER);
        put("json/pag.json", "{}");
        plant(
            [
                leafA(LEAF, "/records/architecture/a.md"),
                row("architecture:b", "/json/records/architecture/b", OTHER, null),
            ],
            ["records/architecture/a.md"],
        );
        expect(catalogFindings(root, SITE, new Set(["json/pag.json"]))).toStrictEqual([]);
    });

    it("reports a Markdown leaf the catalog sitemap leaves out and a location that is no leaf", () => {
        put("records/architecture/a.md", "# A\n");
        put(A_FILE, "{}");
        plant([leafA("{}", "/records/architecture/a.md")], ["records/architecture/gone.md"]);
        const messages = catalogFindings(root, SITE, new Set()).map((finding) => finding.message);
        expect(messages).toStrictEqual([
            "The catalog sitemap does not list records/architecture/a.md.",
            "The catalog sitemap lists records/architecture/gone.md, which is not a catalog leaf.",
        ]);
    });

    it("reports a leaf whose fingerprint is not the sha256 of its exact bytes", () => {
        put(A_FILE, "{}");
        const separated = ["architecture:a", "record", "architecture:a", `${SITE}/json/records/architecture/a`, null];
        plant([[...separated, Buffer.byteLength("{}"), fingerprintOf(["{}"])]], []);
        expect(catalogFindings(root, SITE, new Set()).map((finding) => finding.file)).toStrictEqual([A_FILE]);
        plant([[...separated, Buffer.byteLength("{}"), digestOf("{}")]], []);
        expect(catalogFindings(root, SITE, new Set())).toStrictEqual([]);
    });

    it("reports an id piece the head names but the build did not produce", () => {
        plant([], []);
        rmSync(join(root, "json/api/ids/architecture.json"));
        expect(catalogFindings(root, SITE, new Set()).map((finding) => finding.message)).toStrictEqual([
            `Names ${SITE}/json/api/ids/architecture, which the build does not serve.`,
        ]);
    });

    it("reports a missing leaf, a stale size, an orphan and each dangling address", () => {
        put(A_FILE, LEAF);
        put("json/records/architecture/stray.json", "{}");
        plant([leafA(`${LEAF} `, null), row("architecture:gone", "/json/records/architecture/gone", OTHER, null)], []);
        const messages = catalogFindings(root, SITE, new Set()).map((finding) => `${finding.file} ${finding.message}`);
        expect(messages).toHaveLength(5);
        expect(messages.some((message) => message.startsWith("json/api/ids/architecture.json Names"))).toBe(true);
        expect(messages.some((message) => message.includes("architecture:gone"))).toBe(true);
        expect(messages.some((message) => message.includes("size or fingerprint"))).toBe(true);
        expect(messages.some((message) => message.startsWith("json/records/architecture/stray.json"))).toBe(true);
        expect(messages.some((message) => message.includes(`${SITE}/json/records/architecture/b`))).toBe(true);
    });

    it("accepts a source text its leaf names, and reports a stray text and a named text that is missing", () => {
        const named = JSON.stringify({ text: `${SITE}/source/web/a.ts.txt` });
        const missing = JSON.stringify({ text: `${SITE}/source/web/gone.ts.txt` });
        put("json/source/web/a.ts.json", named);
        put("json/source/web/b.ts.json", missing);
        put("source/web/a.ts.txt", "export const a = 1;\n");
        put("source/web/stray.ts.txt", "export const s = 1;\n");
        plant(
            [
                row("anatomy:a", "/json/source/web/a.ts", named, null),
                row("anatomy:b", "/json/source/web/b.ts", missing, null),
            ],
            [],
        );
        const messages = catalogFindings(root, SITE, new Set()).map((finding) => `${finding.file} ${finding.message}`);
        expect(messages).toStrictEqual([
            "source/web/stray.ts.txt No catalog index lists this file; every leaf is reached from the id manifest.",
            `json/source/web/b.ts.json Names ${SITE}/source/web/gone.ts.txt, which the build does not serve.`,
        ]);
    });

    it("accepts the moved index naming addresses the build no longer serves, and reports a replacement that is missing", () => {
        const moved = JSON.stringify({
            columns: ["ref", "json", "to"],
            rows: [
                ["architecture:old", `${SITE}/json/records/architecture/old`, `${SITE}/json/records/architecture/b`],
                ["architecture:gone", `${SITE}/json/records/architecture/gone`, null],
                ["architecture:lost", `${SITE}/json/records/architecture/lost`, `${SITE}/json/records/architecture/c`],
            ],
        });
        put("json/api/moved.json", moved);
        put("json/records/architecture/b.json", OTHER);
        plant(
            [
                row("api:moved", "/json/api/moved", moved, null),
                row("architecture:b", "/json/records/architecture/b", OTHER, null),
            ],
            [],
        );
        expect(catalogFindings(root, SITE, new Set()).map((finding) => finding.message)).toStrictEqual([
            `Names ${SITE}/json/records/architecture/c, which the build does not serve.`,
        ]);
    });

    it("reports a catalog file over the byte budget and accepts one at it", () => {
        const large = JSON.stringify({ text: "x".repeat(CATALOG_FILE_BUDGET) });
        const fits = JSON.stringify({ text: "x".repeat(CATALOG_FILE_BUDGET - 12) });
        put(A_FILE, large);
        put("json/records/architecture/b.json", fits);
        plant([leafA(large, null), row("architecture:b", "/json/records/architecture/b", fits, null)], []);
        const findings = catalogFindings(root, SITE, new Set());
        expect(findings.map((finding) => finding.file)).toStrictEqual([A_FILE]);
        expect(findings[0]?.message).toContain(`over the ${String(CATALOG_FILE_BUDGET)}-byte budget`);
    });

    it("reports a build with no id manifest at all", () => {
        expect(catalogFindings(root, SITE, new Set())).toHaveLength(1);
    });
});
