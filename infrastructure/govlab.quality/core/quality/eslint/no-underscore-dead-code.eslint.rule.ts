import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface AstNode {
    type: string;
    name?: string;
    id?: AstNode;
    parent?: AstNode;
    params?: AstNode[];
}

const NODE_BUILTINS = new Set(["__filename", "__dirname"]);
const FN_TYPES = new Set(["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"]);
const PATTERN_TYPES = new Set(["ArrayPattern", "ObjectPattern"]);

const isAstNode = function isAstNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isAstNode(value) ? value : null;
};

const isRuleNode = function isRuleNode(value: unknown): value is Rule.Node {
    return value !== null && typeof value === "object" && "type" in value;
};

const isUnderscorePrefixed = function isUnderscorePrefixed(name: string | undefined): name is string {
    return typeof name === "string" && name.startsWith("_") && name !== "_" && !NODE_BUILTINS.has(name);
};

const isFunctionParam = function isFunctionParam(node: AstNode): boolean {
    const { parent } = node;
    if (!parent) {
        return false;
    }
    return FN_TYPES.has(parent.type) && (parent.params?.includes(node) ?? false);
};

const isDestructuringParam = function isDestructuringParam(node: AstNode): boolean {
    if (!node.parent || !PATTERN_TYPES.has(node.parent.type)) {
        return false;
    }
    let current: AstNode | undefined = node.parent;
    while (current) {
        if (FN_TYPES.has(current.type)) {
            return true;
        }
        current = current.parent;
    }
    return false;
};

const isExemptParam = function isExemptParam(node: AstNode): boolean {
    return isFunctionParam(node) || node.parent?.type === "CatchClause" || isDestructuringParam(node);
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const check = function check(id: AstNode | undefined): void {
            if (id?.type !== "Identifier" || !isUnderscorePrefixed(id.name) || isExemptParam(id)) {
                return;
            }
            const { name } = id;
            if (isRuleNode(id)) {
                context.report({ data: { name }, messageId: "noUnderscoreDeadCode", node: id });
            }
        };
        const onDecl = (node: Rule.Node): void => {
            check(asNode(node)?.id);
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["ClassDeclaration", onDecl],
            ["FunctionDeclaration", onDecl],
            ["VariableDeclarator", onDecl],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["no-unused"],
        description: "Disallow underscore-prefixed declarations (dead code markers)",
        messages: {
            noUnderscoreDeadCode:
                "Underscore-prefixed '{{name}}' is dead code. Either implement it (remove the _) or delete it entirely — no 'keep for later'.",
        },
        ruleId: "underscore_prefix_decision_tree",
    }),
} satisfies Rule.RuleModule;
