import { describe, expect, it } from "vitest";
import { VectorAccumulator } from "@govlab/patterns/core/aggregators/representation.vector.aggregator.ts";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";

const SEED = 3;
const OUTLIER = 1000;
const MEAN = 2;

describe("VectorAccumulator", () => {
    it("summarizes numbers and sums numeric lists", () => {
        const accumulator = new VectorAccumulator("score");
        accumulator.update([{ score: 1 }, { score: [1, 2] }, { score: "x" }]);
        const summary = accumulator.result();
        expect(summary.count).toBe(2);
        expect(summary.mean).toBe(MEAN);
        expect(summary.maximum).toBe(MEAN + 1);
    });

    it("ranks the most extreme value first among the outliers", () => {
        const accumulator = new VectorAccumulator("score");
        accumulator.update([{ score: 1 }, { score: 2 }, { score: 1 }, { score: OUTLIER }]);
        expect(accumulator.result().outliers[0]?.[0]).toBe(OUTLIER);
    });

    it("reports an empty summary and samples nothing before any number", () => {
        const accumulator = new VectorAccumulator("score");
        expect(accumulator.result().count).toBe(0);
        expect(accumulator.sample(createRng(SEED))).toBeNull();
    });
});
