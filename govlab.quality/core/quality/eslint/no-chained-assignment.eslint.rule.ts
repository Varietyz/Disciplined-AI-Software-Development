import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

type AssignExpr = Extract<Rule.Node, { type: "AssignmentExpression" }>;

const indentOf = function indentOf(context: Rule.RuleContext, node: Rule.Node): string {
    const line = context.sourceCode.lines[(node.loc?.start.line ?? 1) - 1] ?? "";
    return line.slice(0, line.length - line.trimStart().length);
};

const collectTargets = function collectTargets(
    context: Rule.RuleContext,
    node: AssignExpr,
): { targets: string[]; rhs: string } {
    const targets = [context.sourceCode.getText(node.left)];
    let current = node.right;
    while (current.type === "AssignmentExpression") {
        targets.push(context.sourceCode.getText(current.left));
        current = current.right;
    }
    return { rhs: context.sourceCode.getText(current), targets };
};

const splitChain = function splitChain(context: Rule.RuleContext, node: AssignExpr): string {
    const { rhs, targets } = collectTargets(context, node);
    const indent = indentOf(context, node);
    const lines: string[] = [];
    for (let i = targets.length - 1; i >= 0; i -= 1) {
        const source = i + 1 < targets.length ? targets[i + 1] : rhs;
        lines.push(`${targets[i]} = ${source};`);
    }
    return lines.join(`\n${indent}`);
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onAssign = (node: Rule.Node): void => {
            if (node.type !== "AssignmentExpression" || node.right.type !== "AssignmentExpression") {
                return;
            }
            const statement = node.parent;
            const fixable = statement.type === "ExpressionStatement";
            context.report({
                ...(fixable
                    ? { fix: (fixer): Rule.Fix => fixer.replaceText(statement, splitChain(context, node)) }
                    : {}),
                messageId: "unexpected",
                node,
            });
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["AssignmentExpression", onAssign]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["idiomatic-preference"],
        description: "Disallow chained assignment (`a = b = c`); split into sequential statements",
        fixable: "code",
        messages: { unexpected: "Chained assignment is not allowed; assign each target in its own statement." },
        ruleId: "no_chained_assignment",
        type: "suggestion",
    }),
} satisfies Rule.RuleModule;
