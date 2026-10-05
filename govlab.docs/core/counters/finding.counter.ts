import type { Categories, PerDocEntry } from "#types/finding.types";
import { FINDING_CATEGORIES } from "#configuration/constants/finding.constants";

export const countFindings = function countFindings(all: Categories): number {
    return FINDING_CATEGORIES.reduce((sum, key) => sum + (all[key]?.length ?? 0), 0);
};

export const sumCategories = function sumCategories(perDoc: readonly PerDocEntry[]): Record<string, number> {
    return Object.fromEntries(
        FINDING_CATEGORIES.map((key) => [key, perDoc.reduce((sum, entry) => sum + (entry.all[key]?.length ?? 0), 0)]),
    );
};
