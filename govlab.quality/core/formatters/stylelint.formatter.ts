import { canonOf } from "#core/registries/stylelint.registry";
import { withCanon } from "#core/formatters/canon.formatter";

export const withRuleId = function withRuleId(text: string, ruleId: string): string {
    return withCanon(text, ruleId, canonOf(ruleId));
};
