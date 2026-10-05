import type { AtRule, Declaration, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { extractClamps } from "#core/parsers/css.parser";
import { numericPx } from "#core/converters/css.converter";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/responsive-pattern";
const ruleId = "responsive_pattern";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["responsive-design"],
        description: "Enforce valid clamp() bounds and mobile-first (min-width) media queries",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const messages = utils.ruleMessages(ruleName, {
    clampOrder: (full: string): string => withRuleId(`Invalid clamp '${full}': min must be less than max.`, ruleId),
    clampPreferred: (full: string): string =>
        withRuleId(
            `clamp '${full}' preferred value should be flexible (vw/vh/%) so it scales between the bounds.`,
            ruleId,
        ),
    desktopFirst: (params: string): string =>
        withRuleId(
            `Media query '${params}' is desktop-first — it upper-bounds width (max-width, or the range form 'width <= X' / 'X >= width'), so it styles down from a desktop base. Use a min-width / 'width >= X' cascade so the base is mobile and larger screens add overrides.`,
            ruleId,
        ),
});

const upperBoundsWidth = function upperBoundsWidth(params: string): boolean {
    const p = params.split(" ").join("");
    return p.includes("max-width") || p.includes("width<=") || p.includes(">=width");
};

const isFlexible = function isFlexible(token: string): boolean {
    return token.includes("vw") || token.includes("vh") || token.includes("%");
};

const checkClamps = function checkClamps(decl: Declaration, result: PostcssResult): void {
    for (const clamp of extractClamps(decl.value)) {
        const min = numericPx(clamp.min);
        const max = numericPx(clamp.max);
        if (min !== null && max !== null && min >= max) {
            utils.report({ message: messages.clampOrder(clamp.full), node: decl, result, ruleName });
        }
        if (!isFlexible(clamp.preferred)) {
            utils.report({ message: messages.clampPreferred(clamp.full), node: decl, result, ruleName });
        }
    }
};

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            root.walkDecls((decl: Declaration) => {
                if (decl.value.includes("clamp(")) {
                    checkClamps(decl, result);
                }
            });
            root.walkAtRules("media", (atRule: AtRule) => {
                if (!atRule.params.includes("print") && upperBoundsWidth(atRule.params)) {
                    utils.report({ message: messages.desktopFirst(atRule.params), node: atRule, result, ruleName });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
