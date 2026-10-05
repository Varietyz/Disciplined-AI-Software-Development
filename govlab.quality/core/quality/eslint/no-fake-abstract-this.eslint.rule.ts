import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface AstNode {
    type: string;
    operator?: string;
    argument?: unknown;
    left?: unknown;
    right?: unknown;
}

const COMPARISON_OPERATORS = new Set(["==", "!=", "===", "!=="]);

const isAst = function isAst(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const isThis = function isThis(value: unknown): boolean {
    return isAst(value) && value.type === "ThisExpression";
};

const testsThis = function testsThis(test: unknown): boolean {
    if (isThis(test)) {
        return true;
    }
    if (!isAst(test)) {
        return false;
    }
    if (test.type === "UnaryExpression" && test.operator === "!") {
        return isThis(test.argument);
    }
    if (
        test.type === "BinaryExpression" &&
        typeof test.operator === "string" &&
        COMPARISON_OPERATORS.has(test.operator)
    ) {
        return isThis(test.left) || isThis(test.right);
    }
    return false;
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onIf = (node: Rule.Node): void => {
            if (node.type !== "IfStatement") {
                return;
            }
            if (testsThis(node.test)) {
                context.report({ messageId: "fakeAbstract", node: node.test });
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["IfStatement", onIf]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["design-by-contract"],
        description:
            "Disallow branching on `this` (`if (this)`, `!this`, `this == null`) — an always-constant condition used to fake a `this`-use and dodge class-methods-use-this in a throw-based fake-abstract base; model the contract as an interface + factory instead",
        messages: {
            fakeAbstract:
                "Branching on `this` is always constant inside a method and fakes a `this`-use to dodge class-methods-use-this; replace the fake-abstract base class with an interface + factory contract.",
        },
        ruleId: "no_fake_abstract_this",
        type: "problem",
    }),
} satisfies Rule.RuleModule;
