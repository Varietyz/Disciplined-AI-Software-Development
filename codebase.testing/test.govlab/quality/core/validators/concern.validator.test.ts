import { describe, expect, it } from "vitest";
import { validateConcerns } from "@govlab/quality/core/validators/concern.validator.ts";

const THREE = 3;
const VALID = new Set(["deep-nesting"]);

const concerns = function concerns(entries: [string, boolean | number][]): Record<string, boolean | number> {
    return Object.fromEntries(entries);
};

describe("validateConcerns", () => {
    it("accepts a map of known concepts", () => {
        const input = concerns([["deep-nesting", THREE]]);
        expect(validateConcerns(input, VALID)).toStrictEqual(input);
    });

    it("rejects an array and an unknown concept", () => {
        expect(() => validateConcerns([], VALID)).toThrow();
        expect(() => validateConcerns(concerns([["nope", true]]), VALID)).toThrow();
    });

    it("accepts any key when the concept set is empty", () => {
        const input = concerns([["nope", true]]);
        expect(validateConcerns(input, new Set())).toStrictEqual(input);
    });
});
