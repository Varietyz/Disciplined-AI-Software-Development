import { describe, expect, it } from "vitest";
import { hexArtifactsExist, moduleFingerprint, openReportCache } from "@govlab/patterns/core/caches/report.cache.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

const TWO = 2;

describe("the report cache", () => {
    it("fingerprints deterministically and reflects a fan-in change", () => {
        const base = moduleFingerprint(["x"], [["k", 1]], []);
        expect(moduleFingerprint(["x"], [["k", 1]], [])).toBe(base);
        expect(moduleFingerprint(["x"], [["k", TWO]], [])).not.toBe(base);
    });

    it("reports a module with no written findings as lacking artifacts", () => {
        const absent = join(tmpdir(), "no-such-hex-module");
        expect(hexArtifactsExist(absent)).toBe(false);
    });

    it("treats every key as changed when forced", () => {
        const cache = openReportCache(true);
        cache.update("k", "h");
        expect(cache.unchanged("k", "h")).toBe(false);
    });
});
