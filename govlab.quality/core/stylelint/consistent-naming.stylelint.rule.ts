import type { Rule as CssRule, Root } from "postcss";
import { isAsciiLower, isAsciiUpper, isKebabChar } from "#core/predicates/code-point.predicate";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { extractClassNames } from "#core/parsers/css.parser";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/consistent-naming";
const ruleId = "consistent_naming";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["naming-convention"],
        description: "Require lowercase-kebab-case CSS class names (underscores only as valid BEM)",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const messages = utils.ruleMessages(ruleName, {
    underscore: (name: string): string =>
        withRuleId(
            `Class '${name}' uses underscores outside valid BEM. Use kebab-case (hyphens), not underscores.`,
            ruleId,
        ),
    upperCase: (name: string): string =>
        withRuleId(`Class '${name}' has uppercase letters. Use lowercase-kebab-case for CSS class names.`, ruleId),
});

const MAX_BEM_PARTS = 2;

const hasUpperCase = function hasUpperCase(name: string): boolean {
    for (let i = 0; i < name.length; i += 1) {
        if (isAsciiUpper(name.codePointAt(i))) {
            return true;
        }
    }
    return false;
};

const isKebabSegment = function isKebabSegment(segment: string): boolean {
    if (segment.length === 0 || !isAsciiLower(segment.codePointAt(0))) {
        return false;
    }
    for (let i = 1; i < segment.length; i += 1) {
        if (!isKebabChar(segment.codePointAt(i))) {
            return false;
        }
    }
    return true;
};

const isValidBem = function isValidBem(name: string): boolean {
    const elementParts = name.split("__");
    if (elementParts.length > MAX_BEM_PARTS) {
        return false;
    }
    for (const part of elementParts) {
        const modifierParts = part.split("--");
        if (modifierParts.length > MAX_BEM_PARTS || !modifierParts.every(isKebabSegment)) {
            return false;
        }
    }
    return true;
};

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            root.walkRules((cssRule: CssRule) => {
                for (const name of extractClassNames(cssRule.selector)) {
                    if (hasUpperCase(name)) {
                        utils.report({
                            message: messages.upperCase(name),
                            node: cssRule,
                            result,
                            ruleName,
                            word: name,
                        });
                    }
                    if (name.includes("_") && !isValidBem(name)) {
                        utils.report({
                            message: messages.underscore(name),
                            node: cssRule,
                            result,
                            ruleName,
                            word: name,
                        });
                    }
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
