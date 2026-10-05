import { describe, expect, it } from "vitest";
import { SequenceAccumulator } from "@govlab/patterns/core/aggregators/representation.sequence.aggregator.ts";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";

const SEED = 3;

describe("SequenceAccumulator", () => {
    it("tracks runs, transitions and the last value", () => {
        const accumulator = new SequenceAccumulator("state");
        accumulator.update([{ state: "a" }, { state: "a" }, { state: "b" }, { state: "a" }]);
        const summary = accumulator.result();
        expect(summary.longestRun).toBe(2);
        expect(summary.lastValue).toBe("a");
        expect(summary.topTransitions.map(([pair]) => pair)).toContainEqual(["a", "b"]);
        expect(summary.runLengths).toStrictEqual([
            [1, 2],
            [2, 1],
        ]);
    });

    it("samples a seen value, and nothing before any value", () => {
        const accumulator = new SequenceAccumulator("state");
        expect(accumulator.sample(createRng(SEED))).toBeNull();
        accumulator.update([{ state: "a" }]);
        expect(accumulator.sample(createRng(SEED))).toBe("a");
    });
});
