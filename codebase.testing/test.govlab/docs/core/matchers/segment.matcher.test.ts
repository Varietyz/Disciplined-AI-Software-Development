import { afterAll, describe, expect, it } from "vitest";
import { expandGlob, segmentMatches } from "@govlab/docs/core/matchers/segment.matcher.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "doc-glob-"));
mkdirSync(join(root, "entrypoints"), { recursive: true });
writeVerbatim(join(root, "entrypoints", "a.entrypoint.ts"), "");
writeVerbatim(join(root, "entrypoints", "b.helper.ts"), "");

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("segmentMatches", () => {
    it("matches a literal segment exactly and a starred segment by its head and tail", () => {
        expect(segmentMatches("index.ts", "index.ts")).toBe(true);
        expect(segmentMatches("*.entrypoint.ts", "a.entrypoint.ts")).toBe(true);
        expect(segmentMatches("*.entrypoint.ts", "b.helper.ts")).toBe(false);
        expect(segmentMatches("ab*ba", "aba")).toBe(false);
    });
});

describe("expandGlob", () => {
    it("expands folder and file segments to the matching files only", () => {
        expect(expandGlob(root, ["entrypoints", "*.entrypoint.ts"])).toStrictEqual([
            join(root, "entrypoints", "a.entrypoint.ts"),
        ]);
        expect(expandGlob(root, ["entrypoints"])).toStrictEqual([]);
        expect(expandGlob(root, [])).toStrictEqual([]);
    });
});
