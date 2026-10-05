import {
    FILE_TYPES_KEY,
    GRAMMARS_KEY,
    GRAMMAR_CONFIG_FILE,
    NAME_KEY,
    PACKAGE_GRAMMAR_KEY,
    PACKAGE_MANIFEST_FILE,
} from "@govlab/code-parse/configuration/constants/grammar.constants.ts";
import { describe, expect, it } from "vitest";
import { fileTypesForSource, readGrammarMeta } from "@govlab/code-parse/core/loaders/manifest.loader.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { isRecord } from "@govlab/code-parse/core/predicates/record.predicate.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const withPackage = function withPackage(body: (dir: string) => void): void {
    const dir = mkdtempSync(join(tmpdir(), "grammar-meta-"));
    try {
        body(dir);
    } finally {
        rmSync(dir, { force: true, recursive: true });
    }
};

describe("readGrammarMeta and fileTypesForSource", () => {
    it("takes a grammar's own file types, and the pooled ones when it declares none", () => {
        withPackage((dir) => {
            const grammars = [{ [FILE_TYPES_KEY]: ["ts"], [NAME_KEY]: "typescript" }, { [NAME_KEY]: "tsx" }];
            writeVerbatim(join(dir, GRAMMAR_CONFIG_FILE), JSON.stringify({ [GRAMMARS_KEY]: grammars }));
            writeVerbatim(
                join(dir, PACKAGE_MANIFEST_FILE),
                JSON.stringify({ [PACKAGE_GRAMMAR_KEY]: [{ [FILE_TYPES_KEY]: ["tsx"] }] }),
            );
            const meta = readGrammarMeta(dir);
            expect(fileTypesForSource({ lang: "typescript" }, meta)).toStrictEqual(["ts"]);
            expect(fileTypesForSource({ lang: "tsx" }, meta)).toStrictEqual(["ts", "tsx"]);
        });
    });

    it("reads an empty pool from a package with no manifests", () => {
        withPackage((dir) => {
            expect(readGrammarMeta(dir)).toStrictEqual({ entries: [], pool: [] });
        });
    });
});

describe("isRecord", () => {
    it("accepts a plain object and refuses an array and null", () => {
        expect(isRecord({})).toBe(true);
        expect(isRecord([])).toBe(false);
        expect(isRecord(null)).toBe(false);
    });
});
