import { describe, expect, it } from "vitest";
import { expandPattern, segmentMatches } from "@project/scripts/core/resolvers/pattern.resolver.ts";
import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("segmentMatches", () => {
    it("matches a star across any run of characters and a question mark on one", () => {
        expect(segmentMatches("page.step.ts", "*.step.ts")).toBe(true);
        expect(segmentMatches("page.step.ts", "*.record.ts")).toBe(false);
        expect(segmentMatches("a.ts", "?.ts")).toBe(true);
        expect(segmentMatches("ab.ts", "?.ts")).toBe(false);
        expect(segmentMatches("anything", "*")).toBe(true);
    });
});

describe("expandPattern", () => {
    it("walks a parent step, a deep wildcard and a plain segment to the files they name", () => {
        const root = mkdtempSync(join(tmpdir(), "pattern-"));
        mkdirSync(join(root, "steps", "deep"), { recursive: true });
        writeVerbatim(join(root, "steps", "a.step.ts"), "");
        writeVerbatim(join(root, "steps", "deep", "b.step.ts"), "");
        const barrel = join(root, "barrels");
        mkdirSync(barrel);
        expect(expandPattern(barrel, ["..", "steps", "*.step.ts"])).toStrictEqual([join(root, "steps", "a.step.ts")]);
        expect(expandPattern(root, ["steps", "**", "*.step.ts"]).toSorted()).toStrictEqual(
            [join(root, "steps", "a.step.ts"), join(root, "steps", "deep", "b.step.ts")].toSorted(),
        );
        expect(expandPattern(root, [])).toStrictEqual([]);
        expect(expandPattern(join(root, "missing"), ["*.ts"])).toStrictEqual([]);
    });
});
