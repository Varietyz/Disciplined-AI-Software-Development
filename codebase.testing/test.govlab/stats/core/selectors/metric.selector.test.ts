import { describe, expect, it } from "vitest";
import { percentile, tally } from "@govlab/stats/core/selectors/metric.selector.ts";

describe("percentile", () => {
    const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it("reads the value at a fraction, clamped to the sample", () => {
        expect(percentile(sorted, 0)).toBe(1);
        expect(percentile(sorted, 0.5)).toBe(6);
        expect(percentile(sorted, 1)).toBe(10);
        expect(percentile([], 0.5)).toBe(0);
    });
});

describe("tally", () => {
    it("counts items by the key picked from each", () => {
        expect(tally(["a", "b", "a"], (item) => item)).toStrictEqual(
            new Map([
                ["a", 2],
                ["b", 1],
            ]),
        );
    });
});
