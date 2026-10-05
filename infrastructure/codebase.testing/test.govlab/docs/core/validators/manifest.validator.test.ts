import { describe, expect, it } from "vitest";
import { validateManifest } from "@govlab/docs/core/validators/manifest.validator.ts";

const VALID = {
    ecosystem: "typescript",
    incompatibleWith: [],
    label: "X",
    maturity: "stable",
    overlaps: [],
    summary: "y",
    supersedes: [],
    visibility: { hidden: false, private: false },
};

describe("validateManifest", () => {
    it("accepts a well-formed manifest and refuses one that is not an object", () => {
        expect(validateManifest(VALID)).toStrictEqual([]);
        expect(validateManifest("x")).toHaveLength(1);
    });

    it("reports missing required fields and a missing visibility block", () => {
        const errors = validateManifest({ visibility: {} });
        expect(errors.some((error) => error.includes("label"))).toBe(true);
        expect(errors.some((error) => error.includes("maturity"))).toBe(true);
        expect(
            validateManifest({ label: "a", maturity: "stable", summary: "b" }).some((error) =>
                error.includes("visibility"),
            ),
        ).toBe(true);
    });

    it("reports a declared computed field and an unknown key", () => {
        const errors = validateManifest({ ...VALID, bogus: 1, requires: [] });
        expect(errors.some((error) => error.includes("computed field 'requires'"))).toBe(true);
        expect(errors.some((error) => error.includes("unknown key 'bogus'"))).toBe(true);
    });

    it("reports a malformed relationship, capability list and visibility flag", () => {
        const errors = validateManifest({
            ...VALID,
            capabilities: [""],
            overlaps: [{ package: "a" }],
            visibility: { private: "yes" },
        });
        expect(errors.some((error) => error.includes("overlaps"))).toBe(true);
        expect(errors.some((error) => error.includes("capabilities"))).toBe(true);
        expect(errors.some((error) => error.includes("visibility.private"))).toBe(true);
    });
});
