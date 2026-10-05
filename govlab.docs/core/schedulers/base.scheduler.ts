import type { WeightedUnit } from "#types/index.types";

const MIN_BUCKETS = 1;

const leastLoadedIndex = function leastLoadedIndex(loads: readonly number[]): number {
    let best = 0;
    for (let at = 1; at < loads.length; at += 1) {
        if ((loads[at] ?? 0) < (loads[best] ?? 0)) {
            best = at;
        }
    }
    return best;
};

export const longestProcessingTimeBuckets = function longestProcessingTimeBuckets(
    units: readonly WeightedUnit[],
    bucketCount: number,
): string[][] {
    if (units.length === 0) {
        return [];
    }
    const count = Math.max(MIN_BUCKETS, Math.min(bucketCount, units.length));
    const buckets: string[][] = Array.from({ length: count }, () => []);
    const loads: number[] = Array.from({ length: count }, () => 0);
    for (const unit of units.toSorted((left, right) => right.cost - left.cost)) {
        const target = leastLoadedIndex(loads);
        buckets[target]?.push(unit.id);
        loads[target] = (loads[target] ?? 0) + unit.cost;
    }
    return buckets.filter((bucket) => bucket.length > 0);
};
