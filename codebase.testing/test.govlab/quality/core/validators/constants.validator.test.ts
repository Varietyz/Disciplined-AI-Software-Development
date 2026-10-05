import { describe, expect, it } from "vitest";
import { validateWith } from "./validation.fixture.ts";

const TWO = 2;

describe("the constant-aliases validator", () => {
    it("flags a constant that is a bare alias of another declared constant", () => {
        const found = validateWith("constant-aliases", [
            ["a.ts", "export const BASE_URL = 'x';"],
            ["b.ts", "const API_ROOT = BASE_URL;"],
        ]);
        expect(found).toHaveLength(1);
        expect(found[0]?.file).toBe("b.ts");
        expect(found[0]?.message).toContain("API_ROOT");
        expect(found[0]?.message).toContain("BASE_URL");
    });

    it("does not flag a value that is not a known constant", () => {
        expect(validateWith("constant-aliases", [["a.ts", "const X = someFn();\nconst Y = 3;"]])).toEqual([]);
    });
});

describe("the constant-duplicates validator", () => {
    it("flags a constant defined with the same value in multiple files", () => {
        const found = validateWith("constant-duplicates", [
            ["a.ts", "const RADIX = 10;"],
            ["b.ts", "const RADIX = 10;"],
        ]);
        expect(found).toHaveLength(TWO);
        expect(found.every((finding) => finding.message.includes("RADIX"))).toBe(true);
    });

    it("does not flag the same name declared with different values", () => {
        const found = validateWith("constant-duplicates", [
            ["a.ts", "const DEFAULT_LIMIT = 50;"],
            ["b.ts", "const DEFAULT_LIMIT = 500;"],
        ]);
        expect(found).toEqual([]);
    });
});
