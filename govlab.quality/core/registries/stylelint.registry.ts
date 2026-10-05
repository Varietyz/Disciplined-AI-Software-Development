import type { GovlabStylelintMeta } from "#types/stylelint.types";

const canonByRuleId = new Map<string, string[]>();

export const registerCanon = function registerCanon(rule: GovlabStylelintMeta): void {
    if (rule.meta.canonical.length > 0) {
        canonByRuleId.set(rule.ruleId, rule.meta.canonical);
    }
};

export const canonOf = function canonOf(ruleId: string): readonly string[] {
    return canonByRuleId.get(ruleId) ?? [];
};
