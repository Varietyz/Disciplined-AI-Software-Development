import { describe, expect, it } from "vitest";
import type { WeightedUnit } from "@govlab/docs/types/index.types.ts";
import { longestProcessingTimeBuckets } from "@govlab/docs/core/schedulers/base.scheduler.ts";

const unit = function unit(id: string, cost: number): WeightedUnit {
    return { cost, id };
};

describe("longestProcessingTimeBuckets", () => {
    it("plans nothing for no units and never returns an empty bucket", () => {
        expect(longestProcessingTimeBuckets([], 4)).toStrictEqual([]);
        expect(longestProcessingTimeBuckets([unit("a", 1)], 8)).toStrictEqual([["a"]]);
    });

    it("places every unit exactly once", () => {
        const units = [unit("a", 5), unit("b", 4), unit("c", 3), unit("d", 2)];
        const placed: string[] = longestProcessingTimeBuckets(units, 2).flat();
        expect(placed.toSorted((left, right) => left.localeCompare(right))).toStrictEqual(["a", "b", "c", "d"]);
    });

    it("gives the heaviest unit its own bucket first", () => {
        const buckets = longestProcessingTimeBuckets([unit("heavy", 10), unit("a", 1), unit("b", 1)], 2);
        expect(buckets).toHaveLength(2);
        expect(buckets[0]).toStrictEqual(["heavy"]);
    });

    it("collapses to one bucket when asked for fewer than one", () => {
        expect(longestProcessingTimeBuckets([unit("a", 1), unit("b", 1)], 0)).toHaveLength(1);
    });
});
