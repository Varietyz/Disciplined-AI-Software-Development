export const compareText = function compareText(a: string, b: string): number {
    const shared = Math.min(a.length, b.length);
    for (let i = 0; i < shared; i += 1) {
        const diff = (a.codePointAt(i) ?? 0) - (b.codePointAt(i) ?? 0);
        if (diff !== 0) {
            return diff;
        }
    }
    return a.length - b.length;
};
