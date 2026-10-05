import { describe, expect, it } from "vitest";
import { GridAccumulator } from "@govlab/patterns/core/aggregators/representation.grid.aggregator.ts";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";

const FAR = 5;
const POINTS = 3;
const SEED = 3;

describe("GridAccumulator", () => {
    it("bins coordinate pairs into cells and reports the densest", () => {
        const accumulator = new GridAccumulator("point");
        accumulator.update([{ point: [0, 0] }, { point: [0, 0] }, { point: [FAR, FAR] }, { point: "x" }]);
        expect(accumulator.result()).toStrictEqual({
            densestCell: "0,0",
            densestCount: 2,
            distinctCells: 2,
            field: "point",
            points: POINTS,
        });
    });

    it("reports an empty grid and samples nothing from it", () => {
        const accumulator = new GridAccumulator("point");
        expect(accumulator.result().densestCount).toBe(0);
        expect(accumulator.sample(createRng(SEED))).toBeNull();
    });
});
