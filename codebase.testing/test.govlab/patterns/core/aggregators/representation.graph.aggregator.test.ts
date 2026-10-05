import { describe, expect, it } from "vitest";
import { GraphAccumulator } from "@govlab/patterns/core/aggregators/representation.graph.aggregator.ts";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";

const RECORDS = 10_000;
const STATE_BOUND = 200;
const THREE = 3;
const SEED = 3;

const sizeOf = function sizeOf(value: unknown): number {
    if (value instanceof Map || value instanceof Set) {
        return value.size;
    }
    return Array.isArray(value) ? value.length : 0;
};

describe("GraphAccumulator", () => {
    it("summarizes members, pairs and repeats over list fields", () => {
        const accumulator = new GraphAccumulator("tags");
        accumulator.update([{ tags: ["a", "b"] }, { tags: ["a", "c"] }, { tags: ["a", "b"] }]);
        const summary = accumulator.result();
        expect(summary.distinctTargets).toBe(THREE);
        expect(summary.distinctSets).toBe(2);
        expect(summary.topMembers[0]).toStrictEqual(["a", THREE]);
        expect(summary.composition).toBeNull();
    });

    it("keeps retained state proportional to distinct structures, not records", () => {
        const accumulator = new GraphAccumulator("f");
        for (let i = 0; i < RECORDS; i += 1) {
            accumulator.update([{ f: ["a", "b", "c"] }]);
        }
        expect(accumulator.result().distinctSets).toBe(1);
        expect(Object.values(accumulator).reduce((total: number, value) => total + sizeOf(value), 0)).toBeLessThan(
            STATE_BOUND,
        );
    });

    it("samples members of a typical list size", () => {
        const accumulator = new GraphAccumulator("tags");
        accumulator.update([{ tags: ["a", "b"] }]);
        expect(accumulator.sample(createRng(SEED))).toHaveLength(2);
    });
});
