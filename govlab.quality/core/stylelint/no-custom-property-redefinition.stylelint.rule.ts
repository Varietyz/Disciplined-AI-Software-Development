import type { ChildNode, Rule as CssRule, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/no-custom-property-redefinition";
const ruleId = "no_custom_property_redefinition";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["design-tokens", "no-unused"],
        description: "Forbid redefining the same custom property twice within one selector block",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const messages = utils.ruleMessages(ruleName, {
    redefined: (name: string): string =>
        withRuleId(
            `Custom property '${name}' is redefined in the same block. The later value silently overrides the earlier — remove the dead declaration.`,
            ruleId,
        ),
});

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            root.walkRules((cssRule: CssRule) => {
                const seen = new Set<string>();
                cssRule.each((node: ChildNode) => {
                    if (node.type !== "decl" || !node.prop.startsWith("--")) {
                        return;
                    }
                    if (seen.has(node.prop)) {
                        utils.report({
                            message: messages.redefined(node.prop),
                            node,
                            result,
                            ruleName,
                            word: node.prop,
                        });
                    } else {
                        seen.add(node.prop);
                    }
                });
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
