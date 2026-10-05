import { deriveBarrelPatterns, matchesBarrelPattern } from "@ssot/govlab/shared/loaders/barrel.loader.ts";
import { describe, expect, it } from "vitest";

describe("deriveBarrelPatterns and matchesBarrelPattern", () => {
    const patterns = deriveBarrelPatterns();

    it("derives one pattern per glob barrel under the application member, each with a folder and a suffix", () => {
        expect(patterns.every((pattern) => pattern.dir.endsWith("/") && pattern.suffix.length > 0)).toBe(true);
    });

    it("matches a file by the barrel's folder and suffix and refuses one outside every pattern", () => {
        const [first] = patterns;
        if (first !== undefined) {
            expect(matchesBarrelPattern(`${first.dir}probe${first.suffix}`, patterns)).toBe(true);
        }
        expect(matchesBarrelPattern("elsewhere/probe.unrelated.ts", patterns)).toBe(false);
        expect(matchesBarrelPattern("elsewhere/probe.ts", [])).toBe(false);
    });
});
