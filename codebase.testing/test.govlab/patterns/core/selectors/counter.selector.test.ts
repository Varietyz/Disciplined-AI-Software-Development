import {
    byCountDesc,
    pickIndex,
    topEntries,
    weightedChoice,
    weightedSample,
} from "@govlab/patterns/core/selectors/counter.selector.ts";
import { describe, expect, it } from "vitest";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";

const SEED = 3;
const LENGTH = 5;
const HEAVY = 9;

describe("the counter selectors", () => {
    it("byCountDesc orders by count, then by key", () => {
        const rows: [string, number][] = [
            ["b", 1],
            ["a", 1],
            ["c", 2],
        ];
        expect(rows.toSorted(byCountDesc).map(([key]) => key)).toStrictEqual(["c", "a", "b"]);
    });

    it("topEntries keeps the highest counts up to the limit", () => {
        const counter = new Map([
            ["a", 1],
            ["b", HEAVY],
            ["c", 2],
        ]);
        expect(topEntries(counter, 2)).toStrictEqual([
            ["b", HEAVY],
            ["c", 2],
        ]);
    });

    it("pickIndex draws an index inside the length", () => {
        const index = pickIndex(createRng(SEED), LENGTH);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(LENGTH);
    });

    it("weightedChoice returns a present key, or null for no weight", () => {
        expect(weightedChoice(createRng(SEED), new Map([["a", 1]]))).toBe("a");
        expect(weightedChoice(createRng(SEED), new Map())).toBeNull();
    });

    it("weightedSample draws distinct keys up to the size", () => {
        const drawn = weightedSample(
            createRng(SEED),
            new Map([
                ["a", 1],
                ["b", 1],
                ["c", 1],
            ]),
            2,
        );
        expect(drawn).toHaveLength(2);
        expect(new Set(drawn).size).toBe(2);
    });
});
