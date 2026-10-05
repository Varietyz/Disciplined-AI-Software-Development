export const byString = function byString<T>(key: (item: T) => string): (left: T, right: T) => number {
    return (left, right) => key(left).localeCompare(key(right));
};
