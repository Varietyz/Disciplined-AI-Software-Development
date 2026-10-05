import type { Linter, Rule } from "eslint";
import { ESLINT_RULE_SUFFIX } from "#configuration/constants/eslint.constants";
import { absolutePath } from "@ssot/paths";
import { eslintRuleEntries } from "#core/converters/rule.converter";
import { loadRuleFolder } from "#core/loaders/rule.loader";

export { govlabMeta } from "#core/factories/eslint.factory";
export type { GovlabRuleSpec } from "#types/eslint.types";

const RULE_FILES = await loadRuleFolder(absolutePath("govlab.quality.eslintRules"), ESLINT_RULE_SUFFIX);
const RULE_ENTRIES = eslintRuleEntries(RULE_FILES);

export const rules: Record<string, Rule.RuleModule> = Object.fromEntries(RULE_ENTRIES);

const ALL_RULES: Linter.RulesRecord = Object.fromEntries(
    RULE_ENTRIES.map(([id]): [string, Linter.RuleEntry] => [`govlab/${id}`, "error"]),
);

export const configs = { all: { rules: ALL_RULES } };

export default { configs, rules };
