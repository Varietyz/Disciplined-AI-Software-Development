import { coverageGap, plugin } from "@govlab/docs/core/plugins/manifest.surface.plugin.ts";
import { describe, expect, it } from "vitest";
import type { Manifest } from "@govlab/docs/types/readme.types.ts";

const KNOWN_SURFACE = "semantic-correctness";

const errorsOf = function errorsOf(manifest: Manifest): string[] {
    return plugin.section?.validate?.(manifest) ?? [];
};

describe("the surface manifest plugin", () => {
    it("validates coversSurfaces against the test-surface ids", () => {
        expect(errorsOf({ coversSurfaces: [KNOWN_SURFACE, "data-correctness"] })).toStrictEqual([]);
        expect(errorsOf({})).toStrictEqual([]);
        expect(
            errorsOf({ coversSurfaces: [KNOWN_SURFACE, "not-a-surface"] }).some((error) =>
                error.includes("not-a-surface"),
            ),
        ).toBe(true);
        expect(errorsOf({ coversSurfaces: KNOWN_SURFACE }).some((error) => error.includes("array"))).toBe(true);
    });

    it("contributes coversSurfaces when declared", () => {
        const entry = { category: null, value: "x" };
        plugin.contribute?.({ coversSurfaces: [KNOWN_SURFACE] }, entry);
        expect(entry).toHaveProperty("coversSurfaces", [KNOWN_SURFACE]);
        const empty = { category: null, value: "x" };
        plugin.contribute?.({}, empty);
        expect(empty).not.toHaveProperty("coversSurfaces");
    });
});

describe("coverageGap", () => {
    it("reports the surfaces a module does not declare", () => {
        const gap = coverageGap([KNOWN_SURFACE]);
        expect(gap).not.toContain(KNOWN_SURFACE);
        expect(gap).toContain("security-correctness");
        expect(coverageGap([]).length).toBeGreaterThanOrEqual(gap.length);
    });
});
