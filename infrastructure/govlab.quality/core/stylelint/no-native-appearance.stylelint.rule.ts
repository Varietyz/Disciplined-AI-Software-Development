import type { Declaration, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/no-native-appearance";
const ruleId = "no_native_appearance";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["css-architecture", "design-tokens"],
        description:
            "Host-supplied control chrome stays reset (appearance:none) — an appearance value never restores it",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const APPEARANCE_PROPS = new Set(["appearance", "-webkit-appearance", "-moz-appearance"]);
const RESET_VALUES = new Set(["none", "initial", "unset"]);

const messages = utils.ruleMessages(ruleName, {
    native: (prop: string, value: string): string =>
        withRuleId(
            `'${prop}: ${value}' restores host-supplied control chrome, which is styled by the host rather than by this stylesheet and so is not reachable from the design tokens. Reset it once per control type at the global layer with '${prop}: none' and style it from tokens there; a control that cannot be token-styled is composed rather than restyled in place.`,
            ruleId,
        ),
});

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            root.walkDecls((decl: Declaration) => {
                if (!APPEARANCE_PROPS.has(decl.prop.toLowerCase())) {
                    return;
                }
                const value = decl.value.trim().toLowerCase();
                if (!RESET_VALUES.has(value)) {
                    utils.report({
                        message: messages.native(decl.prop, decl.value),
                        node: decl,
                        result,
                        ruleName,
                        word: decl.value,
                    });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
