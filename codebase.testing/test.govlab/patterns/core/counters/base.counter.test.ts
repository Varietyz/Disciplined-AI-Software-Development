import { describe, expect, it } from "vitest";
import { increment, maxOf, sumOf, tally } from "@govlab/patterns/core/counters/base.counter.ts";

const THREE = 3;
const FIVE = 5;

describe("the base counters", () => {
    it("sumOf totals any iterable of numbers", () => {
        expect(sumOf([1, 2])).toBe(THREE);
        expect(
            sumOf(
                new Map([
                    ["a", 2],
                    ["b", THREE],
                ]).values(),
            ),
        ).toBe(FIVE);
        expect(sumOf([])).toBe(0);
    });

    it("increment adds one by default and a given step otherwise", () => {
        const counter = new Map<string, number>();
        increment(counter, "a");
        increment(counter, "a", 2);
        expect(counter.get("a")).toBe(THREE);
    });

    it("tally counts items by the key each maps to", () => {
        expect(tally(["x", "y", "x"], (item) => item)).toStrictEqual({ x: 2, y: 1 });
    });

    it("maxOf returns the largest value, or zero for none", () => {
        expect(maxOf([1, FIVE, THREE])).toBe(FIVE);
        expect(maxOf([])).toBe(0);
    });
});
