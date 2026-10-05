export const sumOf = function sumOf(values: Iterable<number>): number {
    let total = 0;
    for (const value of values) {
        total += value;
    }
    return total;
};

export const increment = function increment<K>(counter: Map<K, number>, key: K, by = 1): void {
    counter.set(key, (counter.get(key) ?? 0) + by);
};

export const tally = function tally<T>(items: readonly T[], keyOf: (item: T) => string): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const item of items) {
        const key = keyOf(item);
        counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
};

export const maxOf = function maxOf(values: readonly number[]): number {
    return values.reduce((best, value) => Math.max(best, value), 0);
};
