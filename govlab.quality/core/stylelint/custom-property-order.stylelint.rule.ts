import type { ChildNode, Rule as CssRule, Root } from "postcss";
import { asLayerOptions, layerOf } from "#core/resolvers/layer.resolver";
import { isAsciiDigit, isDot } from "#core/predicates/code-point.predicate";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/custom-property-order";
const ruleId = "custom_property_order";
const CUSTOM_PROPERTY_PREFIX = "--";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["css-architecture"],
        description:
            "Require same-prefix custom properties in the tokens layer to be declared in ascending numeric order",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const TOKENS_LAYER = "tokens";
const SEMANTIC_SUFFIXES = [
    "xxs",
    "xs",
    "sm",
    "base",
    "md",
    "regular",
    "lg",
    "xl",
    "xxl",
    "xxxl",
    "hero",
    "light",
    "normal",
    "medium",
    "semibold",
    "bold",
    "fast",
    "slow",
    "slower",
];

const messages = utils.ruleMessages(ruleName, {
    outOfOrder: (name: string): string =>
        withRuleId(
            `Custom property '${name}' breaks ascending numeric order within its prefix family. Order same-prefix tokens smallest→largest.`,
            ruleId,
        ),
});

const isTokensFile = function isTokensFile(from: string | undefined, secondaryOptions: unknown): boolean {
    return layerOf(from, asLayerOptions(secondaryOptions)) === TOKENS_LAYER;
};

const prefixOf = function prefixOf(name: string): string {
    if (!name.startsWith(CUSTOM_PROPERTY_PREFIX)) {
        return name;
    }
    const body = name.slice(CUSTOM_PROPERTY_PREFIX.length);
    for (const suffix of SEMANTIC_SUFFIXES) {
        if (body.endsWith(`-${suffix}`)) {
            return body.slice(0, body.length - suffix.length - 1);
        }
    }
    return body;
};

const numericValue = function numericValue(value: string): number {
    let digits = "";
    for (let i = 0; i < value.length; i += 1) {
        const code = value.codePointAt(i);
        if (isAsciiDigit(code) || isDot(code)) {
            digits += value[i];
        } else {
            break;
        }
    }
    return digits.length > 0 ? Number(digits) : 0;
};

const checkRoot = function checkRoot(cssRule: CssRule, result: PostcssResult): void {
    let prev: { prefix: string; value: number } | null = null;
    cssRule.each((node: ChildNode) => {
        if (node.type !== "decl" || !node.prop.startsWith("--")) {
            return;
        }
        const decl = node;
        const current = { prefix: prefixOf(decl.prop), value: numericValue(decl.value) };
        if (prev !== null && prev.prefix === current.prefix && prev.value > current.value) {
            utils.report({ message: messages.outOfOrder(decl.prop), node: decl, result, ruleName, word: decl.prop });
        }
        prev = current;
    });
};

const rule: Rule = Object.assign(
    (primary: unknown, secondaryOptions: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true || !isTokensFile(root.source?.input.from, secondaryOptions)) {
                return;
            }
            root.walkRules((cssRule: CssRule) => {
                if (cssRule.selector === ":root") {
                    checkRoot(cssRule, result);
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
