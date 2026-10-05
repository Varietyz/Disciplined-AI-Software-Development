import type { Declaration, Root } from "postcss";
import { hasPxUnit, insideAtRule } from "#core/predicates/css.predicate";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/responsive-units";
const ruleId = "responsive_units";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["responsive-design"],
        description: "Require responsive units (rem/em/%) on scaling properties instead of fixed px",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const RESPONSIVE_PROPS = new Set(["font-size", "width", "max-width", "height", "max-height"]);
const SKIP_ATRULES = new Set(["media", "container"]);

const messages = utils.ruleMessages(ruleName, {
    fixedPx: (prop: string): string =>
        withRuleId(
            `'${prop}' uses a fixed px value. Use rem, em, or % so it scales with the user's root font size — px on scaling properties defeats responsive typography and layout.`,
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
                if (!RESPONSIVE_PROPS.has(decl.prop.toLowerCase()) || insideAtRule(decl, SKIP_ATRULES)) {
                    return;
                }
                if (hasPxUnit(decl.value)) {
                    utils.report({
                        message: messages.fixedPx(decl.prop),
                        node: decl,
                        result,
                        ruleName,
                        word: decl.prop,
                    });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
