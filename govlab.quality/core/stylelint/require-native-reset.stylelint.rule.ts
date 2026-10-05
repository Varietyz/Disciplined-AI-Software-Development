import type { Declaration, Rule as PostcssRule, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/require-native-reset";
const ruleId = "require_native_reset";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["css-architecture", "design-tokens"],
        description:
            "A host-supplied pseudo-element is reset (appearance:none / display:none) before it is styled, or the host paints over the declarations",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const REQUIRE_RESET_PSEUDOS = [
    "::-webkit-slider-thumb",
    "::-webkit-inner-spin-button",
    "::-webkit-outer-spin-button",
    "::-webkit-search-cancel-button",
    "::-webkit-details-marker",
];
const APPEARANCE_PROPS = new Set(["appearance", "-webkit-appearance", "-moz-appearance"]);

const messages = utils.ruleMessages(ruleName, {
    missing: (pseudo: string): string =>
        withRuleId(
            `Host-supplied pseudo-element '${pseudo}' is styled without being reset first, so the host keeps painting its own chrome over these declarations. Add 'appearance: none' to take ownership of it, or 'display: none' to remove it.`,
            ruleId,
        ),
});

const hasReset = function hasReset(rule: PostcssRule): boolean {
    let reset = false;
    rule.walkDecls((decl: Declaration) => {
        const prop = decl.prop.toLowerCase();
        const value = decl.value.trim().toLowerCase();
        if ((APPEARANCE_PROPS.has(prop) && value === "none") || (prop === "display" && value === "none")) {
            reset = true;
        }
    });
    return reset;
};

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            root.walkRules((postcssRule: PostcssRule) => {
                const selector = postcssRule.selector.toLowerCase();
                const pseudo = REQUIRE_RESET_PSEUDOS.find((p) => selector.includes(p));
                if (typeof pseudo === "string" && !hasReset(postcssRule)) {
                    utils.report({
                        message: messages.missing(pseudo),
                        node: postcssRule,
                        result,
                        ruleName,
                        word: pseudo,
                    });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
