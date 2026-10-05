import type { Declaration, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import valueParser from "postcss-value-parser";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/no-custom-property-alias";
const ruleId = "no_custom_property_alias";
const ROOT_SELECTOR = ":root";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["design-tokens"],
        description:
            "Forbid root-level custom properties that alias another variable (--a: var(--b)); a scoped re-binding to a root token is the sanctioned form",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const messages = utils.ruleMessages(ruleName, {
    alias: (name: string): string =>
        withRuleId(
            `Root variable '${name}' is a bare alias of another variable. A root token holds its literal value; only a scoped selector may re-bind a property to a root token.`,
            ruleId,
        ),
});

const isSoleVarReference = function isSoleVarReference(value: string): boolean {
    const nodes = valueParser(value).nodes.filter((node) => node.type !== "space" && node.type !== "div");
    const [first] = nodes;
    return nodes.length === 1 && first?.type === "function" && first.value === "var";
};

const isRootDeclaration = function isRootDeclaration(decl: Declaration): boolean {
    const { parent } = decl;
    if (parent?.type !== "rule" || !("selector" in parent)) {
        return false;
    }
    return typeof parent.selector === "string" && parent.selector.trim() === ROOT_SELECTOR;
};

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            root.walkDecls((decl: Declaration) => {
                if (decl.prop.startsWith("--") && isRootDeclaration(decl) && isSoleVarReference(decl.value)) {
                    utils.report({ message: messages.alias(decl.prop), node: decl, result, ruleName, word: decl.prop });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
