import type { Declaration, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import valueParser from "postcss-value-parser";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/no-shadow";
const ruleId = "no_shadow";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["design-tokens"],
        description: "Depth resolves through the token system — a shadow declaration expresses it outside that system",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const SHADOW_PROPS = new Set(["box-shadow", "-webkit-box-shadow", "text-shadow"]);
const FILTER_PROPS = new Set(["filter", "backdrop-filter"]);

const messages = utils.ruleMessages(ruleName, {
    banned: (prop: string): string =>
        withRuleId(
            `'${prop}' expresses depth per declaration, outside the token system that every other visual axis resolves through. Remove it and separate the surfaces with a declared surface or border token.`,
            ruleId,
        ),
});

const hasDropShadow = function hasDropShadow(value: string): boolean {
    let found = false;
    valueParser(value).walk((node) => {
        if (node.type === "function" && node.value === "drop-shadow") {
            found = true;
        }
    });
    return found;
};

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            root.walkDecls((decl: Declaration) => {
                const prop = decl.prop.toLowerCase();
                if (SHADOW_PROPS.has(prop) || (FILTER_PROPS.has(prop) && hasDropShadow(decl.value))) {
                    utils.report({
                        message: messages.banned(decl.prop),
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
