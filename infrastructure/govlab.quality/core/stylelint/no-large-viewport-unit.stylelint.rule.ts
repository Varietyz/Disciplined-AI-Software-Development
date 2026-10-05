import type { Declaration, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { valueUnits } from "#core/parsers/css.parser";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/no-large-viewport-unit";
const ruleId = "no_large_viewport_unit";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["responsive-design"],
        description: "Forbid the vh unit, which resolves to the largest viewport on mobile browsers",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const LARGE_VIEWPORT_UNIT = "vh";

const messages = utils.ruleMessages(ruleName, {
    largeViewport: (): string =>
        withRuleId(
            "The vh unit resolves to the largest viewport, the one with the browser toolbar hidden, so on a phone a vh height runs under the visible toolbar and cuts off the bottom of the page. Use dvh for a height that follows the toolbar, svh for a height that must stay fully visible, or lvh where the largest viewport is meant.",
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
                if (valueUnits(decl.value).some((token) => token.unit.toLowerCase() === LARGE_VIEWPORT_UNIT)) {
                    utils.report({ message: messages.largeViewport(), node: decl, result, ruleName, word: decl.value });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
