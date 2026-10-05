export const NO_UNUSED_SELECTORS = "[purgecss] no unused selectors\n";

export const unusedHeading = function unusedHeading(count: number): string {
    return `[purgecss] ${String(count)} unused selector(s):`;
};

export const unusedOverflow = function unusedOverflow(more: number, report: string): string {
    return `  ...and ${String(more)} more (see ${report})`;
};
