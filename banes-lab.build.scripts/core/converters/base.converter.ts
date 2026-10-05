export const groupedBy = function groupedBy<T>(
    items: readonly T[],
    keyOf: (item: T) => string,
): ReadonlyMap<string, T[]> {
    const groups = new Map<string, T[]>();
    for (const item of items) {
        const key = keyOf(item);
        const held = groups.get(key);
        if (held === undefined) {
            groups.set(key, [item]);
        } else {
            held.push(item);
        }
    }
    return new Map([...groups.entries()].sort(([left], [right]) => left.localeCompare(right)));
};

export const orNull = function orNull(value?: string): string | null {
    return value === undefined || value.length === 0 ? null : value;
};
