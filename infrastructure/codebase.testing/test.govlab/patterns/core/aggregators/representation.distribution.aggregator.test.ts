import { describe, expect, it } from "vitest";
import { DistributionAccumulator } from "@govlab/patterns/core/aggregators/representation.distribution.aggregator.ts";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";

const RECORDS = 10_000;
const DISTINCT = 5;
const STATE_BOUND = 200;
const PRESENT = 2;
const SEED = 3;

const sizeOf = function sizeOf(value: unknown): number {
    if (value instanceof Map || value instanceof Set) {
        return value.size;
    }
    return Array.isArray(value) ? value.length : 0;
};

describe("DistributionAccumulator", () => {
    it("counts only present, non-null values", () => {
        const accumulator = new DistributionAccumulator("color");
        accumulator.update([{ color: "red" }, { color: "blue" }, { color: null }, {}]);
        expect(accumulator.result().count).toBe(PRESENT);
        expect(accumulator.result().top.map(([value]) => value)).toStrictEqual(["blue", "red"]);
    });

    it("keeps retained state proportional to distinct values, not records", () => {
        const accumulator = new DistributionAccumulator("f");
        for (let i = 0; i < RECORDS; i += 1) {
            accumulator.update([{ f: i % DISTINCT }]);
        }
        expect(accumulator.result().distinct).toBe(DISTINCT);
        expect(Object.values(accumulator).reduce((total: number, value) => total + sizeOf(value), 0)).toBeLessThan(
            STATE_BOUND,
        );
    });

    it("samples a value it has seen", () => {
        const accumulator = new DistributionAccumulator("color");
        accumulator.update([{ color: "red" }]);
        expect(accumulator.sample(createRng(SEED))).toBe("red");
    });
});
