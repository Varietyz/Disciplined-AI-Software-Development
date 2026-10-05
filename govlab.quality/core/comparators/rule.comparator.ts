import type { CatalogRule } from "#types/catalog.types";

const SORT_LOCALE = "en";

export const byRuleId = function byRuleId(a: CatalogRule, b: CatalogRule): number {
    return a.ruleId.localeCompare(b.ruleId, SORT_LOCALE);
};
