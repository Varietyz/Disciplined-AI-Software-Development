import { describe, expect, it } from "vitest";
import { fixedTo, roundTo } from "@govlab/patterns/core/normalizers/math.normalizer.ts";

const VALUE = 1.23456;
const TWO = 2;
const FOUR = 4;
const ROUNDED = 1.23;
const FIXED = 1.2346;

describe("the numeric normalizers", () => {
    it("roundTo rounds to the given decimal places", () => {
        expect(roundTo(VALUE, TWO)).toBeCloseTo(ROUNDED, TWO);
        expect(roundTo(-VALUE, TWO)).toBeCloseTo(-ROUNDED, TWO);
    });

    it("fixedTo keeps toFixed precision as a number", () => {
        expect(fixedTo(VALUE, FOUR)).toBeCloseTo(FIXED, FOUR);
        expect(typeof fixedTo(VALUE, FOUR)).toBe("number");
    });
});
