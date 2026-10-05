import type { CatalogRule } from "#types/catalog.types";

export const distinctRules = function distinctRules(rules: readonly CatalogRule[]): CatalogRule[] {
    const byId = new Map<string, CatalogRule>();
    for (const rule of rules) {
        if (!byId.has(rule.ruleId)) {
            byId.set(rule.ruleId, rule);
        }
    }
    return [...byId.values()];
};
