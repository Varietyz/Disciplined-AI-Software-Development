import type { Linter, Rule } from "eslint";
import { ESLINT_RULE_SUFFIX } from "#configuration/constants/eslint.constants";
import { absolutePath } from "@ssot/paths";
import { eslintRuleEntries } from "#core/converters/rule.converter";
import { loadRuleFolder } from "#core/loaders/rule.loader";

const RULE_FILES = await loadRuleFolder(absolutePath("govlab.quality.contextRules"), ESLINT_RULE_SUFFIX);
const RULE_ENTRIES = eslintRuleEntries(RULE_FILES);

export const rules: Record<string, Rule.RuleModule> = Object.fromEntries(RULE_ENTRIES);

const MODULE_RULES: Linter.RulesRecord = Object.fromEntries(
    Object.keys(rules).map((id): [string, Linter.RuleEntry] => [`govlab-context/${id}`, "error"]),
);

export const configs = { module: { rules: MODULE_RULES } };

export default { configs, rules };
