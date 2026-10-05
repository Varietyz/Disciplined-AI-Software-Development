import type { CatalogRule } from "#types/catalog.types";

const NONE = "none";

export const tallyBy = function tallyBy(rules: readonly CatalogRule[], key: string): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const rule of rules) {
        const value = rule[key];
        const bucket = typeof value === "string" ? value : NONE;
        counts[bucket] = (counts[bucket] ?? 0) + 1;
    }
    return counts;
};
