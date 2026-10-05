import type { Rule } from "eslint";
import { isNode } from "#core/predicates/context.fragment.predicate";
import { stringValue } from "#core/selectors/context.fragment.selector";

const SUFFIXES = ["_PROMPT", "_SECTION", "_INSTRUCTION", "_REMINDER", "_RULE", "_GOAL", "_DISCIPLINE"];

const isPromptPositionName = function isPromptPositionName(name: string): boolean {
    return SUFFIXES.some((suffix) => name.endsWith(suffix));
};

const isContextLiteral = function isContextLiteral(init: unknown): boolean {
    if (!isNode(init)) {
        return false;
    }
    if (init.type === "TemplateLiteral" || stringValue(init) !== null) {
        return true;
    }
    if (init.type === "ArrayExpression" && Array.isArray(init["elements"])) {
        const { elements } = init;
        return elements.length > 0 && elements.every((element) => stringValue(element) !== null);
    }
    return false;
};

export default {
    create(context) {
        const onDeclarator = function onDeclarator(node: Rule.Node): void {
            if (node.type !== "VariableDeclarator" || node.id.type !== "Identifier") {
                return;
            }
            const { name } = node.id;
            if (isPromptPositionName(name) && isContextLiteral(node.init)) {
                context.report({ data: { name }, messageId: "inline", node });
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["VariableDeclarator", onDeclarator]];
        return Object.fromEntries(handlers);
    },

    meta: {
        docs: {
            description:
                "Disallow authoring AI-context prose as a frozen prompt-defining const — compose it as a defineContextFragment.",
        },
        messages: {
            inline: "'{{name}}' authors AI context as a frozen const. Context prose belongs in a defineContextFragment (concern + applies + params), not a monolithic literal re-sent every turn. [no_inline_context_literal]",
        },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
