export const percentile = function percentile(sortedAscending: readonly number[], fraction: number): number {
    if (sortedAscending.length === 0) {
        return 0;
    }
    const index = Math.min(sortedAscending.length - 1, Math.floor(fraction * sortedAscending.length));
    return sortedAscending.at(index) ?? 0;
};

export const tally = function tally<T>(items: readonly T[], pick: (item: T) => string): Map<string, number> {
    const counts = new Map<string, number>();
    for (const item of items) {
        const key = pick(item);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
};
