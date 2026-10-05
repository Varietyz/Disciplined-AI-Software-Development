import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface ParentNode {
    type: string;
    update?: unknown;
    parent?: ParentNode;
}

const isParent = function isParent(value: unknown): value is ParentNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asParent = function asParent(value: unknown): ParentNode | null {
    return isParent(value) ? value : null;
};

const grandForUpdate = function grandForUpdate(parent: ParentNode): boolean {
    if (parent.type !== "SequenceExpression") {
        return false;
    }
    const grand = parent.parent;
    return grand?.type === "ForStatement" && grand.update === parent;
};

const valueUnused = function valueUnused(node: Rule.Node): boolean {
    const parent = asParent(node.parent);
    if (parent === null) {
        return false;
    }
    if (parent.type === "ExpressionStatement") {
        return true;
    }
    if (parent.type === "ForStatement" && parent.update === node) {
        return true;
    }
    return grandForUpdate(parent);
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onUpdate = (node: Rule.Node): void => {
            if (node.type !== "UpdateExpression") {
                return;
            }
            const replacement = node.operator === "++" ? "+=" : "-=";
            const fixable = valueUnused(node);
            context.report({
                data: { operator: node.operator, replacement },
                ...(fixable
                    ? {
                          fix: (fixer): Rule.Fix =>
                              fixer.replaceText(node, `${context.sourceCode.getText(node.argument)} ${replacement} 1`),
                      }
                    : {}),
                messageId: "unexpected",
                node,
            });
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["UpdateExpression", onUpdate]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["operator-style"],
        description: "Disallow the ++ and -- operators; use `+= 1` / `-= 1` (fixed where the value is unused)",
        fixable: "code",
        messages: { unexpected: "Unary operator '{{operator}}' is not allowed; use '{{replacement}} 1'." },
        ruleId: "no_increment_operator",
        type: "suggestion",
    }),
} satisfies Rule.RuleModule;
