import { describe, expect, it } from "vitest";
import { TreeAccumulator } from "@govlab/patterns/core/aggregators/representation.tree.aggregator.ts";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";

const SEED = 3;

describe("TreeAccumulator", () => {
    it("descends nested objects and counts their shape", () => {
        const accumulator = new TreeAccumulator("meta");
        accumulator.update([{ meta: { a: 1, b: { c: "x" } } }, { meta: { a: 2 } }, { meta: "flat" }]);
        const summary = accumulator.result();
        expect(summary.records).toBe(2);
        expect(summary.maxDepth).toBe(2);
        expect(summary.distinctShapes).toBe(2);
        expect(summary.paths.map(([path]) => path)).toContain("b.c");
    });

    it("samples a tree of a seen shape, and nothing before any record", () => {
        const accumulator = new TreeAccumulator("meta");
        expect(accumulator.sample(createRng(SEED))).toBeNull();
        accumulator.update([{ meta: { a: null } }]);
        expect(accumulator.sample(createRng(SEED))).toStrictEqual({ a: null });
    });
});
