import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { STYLELINT_RULE_SUFFIX } from "#configuration/constants/stylelint.constants";
import { absolutePath } from "@ssot/paths";
import { loadRuleFolder } from "#core/loaders/rule.loader";
import { registerCanon } from "#core/registries/stylelint.registry";
import { stylelintRules } from "#core/converters/rule.converter";

const RULE_FILES = await loadRuleFolder(absolutePath("govlab.quality.stylelintRules"), STYLELINT_RULE_SUFFIX);
const RULES = stylelintRules(RULE_FILES);

export const meta: GovlabStylelintMeta[] = RULES.map((rule) => rule.meta);

for (const ruleMeta of meta) {
    registerCanon(ruleMeta);
}

export default RULES.map((rule) => rule.plugin);
