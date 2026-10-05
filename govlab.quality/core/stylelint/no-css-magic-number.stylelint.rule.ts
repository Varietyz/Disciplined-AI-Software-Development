import type { Declaration, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import { CSS_UNITS } from "#configuration/constants/css.constants";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { insideAtRule } from "#core/predicates/css.predicate";
import { valueUnits } from "#core/parsers/css.parser";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/no-css-magic-number";
const ruleId = "no_css_magic_number";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["magic-number", "design-tokens"],
        description: "Forbid magic numeric CSS values; reference a token/variable so the value stays consistent",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const EXCLUDED_PROPS = new Set(["content", "font-family", "animation-name", "grid-template", "transform"]);
const SKIP_VALUES = new Set(["0", "1"]);
const SKIP_FULL = new Set(["100%"]);
const SKIP_ATRULES = new Set(["media", "container"]);

const messages = utils.ruleMessages(ruleName, {
    magic: (value: string): string =>
        withRuleId(
            `Magic numeric value '${value}' bypasses the token system. Define or reference a CSS variable (var(--…)) so the value stays consistent across the design system — 0, 1, and 100% are exempt.`,
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
                if (
                    EXCLUDED_PROPS.has(decl.prop.toLowerCase()) ||
                    decl.value.includes("var(--") ||
                    insideAtRule(decl, SKIP_ATRULES)
                ) {
                    return;
                }
                for (const token of valueUnits(decl.value)) {
                    if (CSS_UNITS.has(token.unit) && !SKIP_VALUES.has(token.number)) {
                        const full = `${token.number}${token.unit}`;
                        if (!SKIP_FULL.has(full)) {
                            utils.report({ message: messages.magic(full), node: decl, result, ruleName, word: full });
                        }
                    }
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
