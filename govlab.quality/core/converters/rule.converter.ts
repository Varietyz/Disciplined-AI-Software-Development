import { isStylelintMeta, isStylelintPlugin } from "#core/predicates/stylelint.predicate";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import type { Plugin } from "stylelint";
import type { Rule } from "eslint";
import type { RuleFile } from "#types/rule.types";
import { isRuleModule } from "#core/predicates/eslint.predicate";
import { notARule } from "#configuration/strings/rule.strings";

const ESLINT_SHAPE = "default eslint rule module";
const STYLELINT_SHAPE = "default stylelint plugin and its RULE_META";

export const eslintRuleEntries = function eslintRuleEntries(files: readonly RuleFile[]): [string, Rule.RuleModule][] {
    return files.map(({ file, id, module }): [string, Rule.RuleModule] => {
        const rule = module["default"];
        if (!isRuleModule(rule)) {
            throw new Error(notARule(file, ESLINT_SHAPE));
        }
        return [id, rule];
    });
};

export const stylelintRules = function stylelintRules(
    files: readonly RuleFile[],
): { meta: GovlabStylelintMeta; plugin: Plugin }[] {
    return files.map(({ file, module }) => {
        const plugin = module["default"];
        const meta = module["RULE_META"];
        if (!isStylelintPlugin(plugin) || !isStylelintMeta(meta)) {
            throw new Error(notARule(file, STYLELINT_SHAPE));
        }
        return { meta, plugin };
    });
};
