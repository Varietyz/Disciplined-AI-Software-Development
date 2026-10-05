import type { GovlabRuleDocs, GovlabRuleSpec } from "#types/eslint.types";
import type { Rule } from "eslint";
import { withCanon } from "#core/formatters/canon.formatter";

export const govlabMeta = function govlabMeta(spec: GovlabRuleSpec): Rule.RuleMetaData {
    const tagged: Record<string, string> = {};
    for (const [id, text] of Object.entries(spec.messages)) {
        tagged[id] = withCanon(text, spec.ruleId, spec.canonical);
    }
    const docs: GovlabRuleDocs = {
        canonical: spec.canonical,
        description: spec.description,
        ruleId: spec.ruleId,
        url: spec.url,
    };
    return {
        docs,
        fixable: spec.fixable,
        hasSuggestions: spec.hasSuggestions,
        messages: tagged,
        schema: spec.schema ?? [],
        type: spec.type ?? "problem",
    };
};
