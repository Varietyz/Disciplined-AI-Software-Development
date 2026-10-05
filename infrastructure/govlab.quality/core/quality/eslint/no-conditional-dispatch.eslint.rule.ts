import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface AstNode {
    type: string;
    name?: string;
    operator?: string;
    computed?: boolean;
    object?: AstNode;
    property?: AstNode;
    left?: AstNode;
    right?: AstNode;
    test?: AstNode | null;
    consequent?: AstNode | null;
    alternate?: AstNode | null;
    parent?: AstNode;
}

const DEFAULT_THRESHOLD = 3;
const EQUALITY_OPERATORS = new Set(["===", "==", "!==", "!="]);
const CONTROL_FLOW = new Set(["ReturnStatement", "BreakStatement", "ContinueStatement", "ThrowStatement"]);
const FUNCTION_NODES = new Set(["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"]);
const IF_SELECTOR = "IfStatement";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const isAstNode = (value: unknown): value is AstNode => isRecord(value) && "type" in value;

const asNode = (value: unknown): AstNode | null => (isAstNode(value) ? value : null);

const resolveThreshold = (raw: unknown): number => {
    const threshold = isRecord(raw) ? raw["threshold"] : DEFAULT_THRESHOLD;
    return typeof threshold === "number" ? threshold : DEFAULT_THRESHOLD;
};

const memberPath = (object: string | null, property: string | undefined): string | null =>
    typeof object === "string" && typeof property === "string" ? `${object}.${property}` : null;

const serialize = (node: AstNode | null | undefined): string | null => {
    if (!node) {
        return null;
    }
    if (node.type === "Identifier") {
        return node.name ?? null;
    }
    if (node.type === "ThisExpression") {
        return "this";
    }
    if (node.type !== "MemberExpression" || node.computed === true) {
        return null;
    }
    return memberPath(serialize(node.object), node.property?.name);
};

const discriminantOf = (test: AstNode | null | undefined): string | null => {
    if (test?.type !== "BinaryExpression" || !EQUALITY_OPERATORS.has(test.operator ?? "")) {
        return null;
    }
    const leftLiteral = test.left?.type === "Literal";
    const rightLiteral = test.right?.type === "Literal";
    if (leftLiteral === rightLiteral) {
        return null;
    }
    return serialize(leftLiteral ? test.right : test.left);
};

const isChainHead = (node: AstNode): boolean => {
    const { parent } = node;
    return !(parent?.type === "IfStatement" && parent.alternate === node);
};

const chainDiscriminants = (head: AstNode): (string | null)[] => {
    const out: (string | null)[] = [];
    let node: AstNode | null | undefined = head;
    while (node?.type === "IfStatement") {
        out.push(discriminantOf(node.test));
        node = node.alternate;
    }
    return out;
};

const hasEscapingControlFlow = (value: unknown): boolean => {
    const node = asNode(value);
    if (node === null) {
        return false;
    }
    if (CONTROL_FLOW.has(node.type)) {
        return true;
    }
    if (FUNCTION_NODES.has(node.type)) {
        return false;
    }
    return Object.entries(node).some(([key, child]): boolean => {
        if (key === "parent") {
            return false;
        }
        if (Array.isArray(child)) {
            return child.some((entry) => hasEscapingControlFlow(entry));
        }
        return hasEscapingControlFlow(child);
    });
};

const chainHasControlFlow = (head: AstNode): boolean => {
    let node: AstNode | null | undefined = head;
    while (node?.type === "IfStatement") {
        if (hasEscapingControlFlow(node.consequent)) {
            return true;
        }
        node = node.alternate;
    }
    return hasEscapingControlFlow(node);
};

const dominant = (discriminants: (string | null)[]): { count: number; name: string } | null => {
    const counts = new Map<string, number>();
    let best: { count: number; name: string } | null = null;
    for (const value of discriminants.filter((entry): entry is string => entry !== null)) {
        const count = (counts.get(value) ?? 0) + 1;
        counts.set(value, count);
        if (best === null || count > best.count) {
            best = { count, name: value };
        }
    }
    return best;
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const threshold = resolveThreshold(context.options[0]);
        const onIf = (node: Rule.Node): void => {
            const head = asNode(node);
            if (head === null || !isChainHead(head)) {
                return;
            }
            const best = dominant(chainDiscriminants(head));
            if (best !== null && best.count >= threshold && !chainHasControlFlow(head)) {
                context.report({
                    data: { count: String(best.count), discriminant: best.name },
                    messageId: "conditionalDispatch",
                    node,
                });
            }
        };
        const listeners: Rule.RuleListener = { [IF_SELECTOR]: onIf };
        return listeners;
    },
    meta: govlabMeta({
        canonical: ["open-closed"],
        description:
            "Disallow an if/else chain dispatching on one discriminant — mandate a data-driven dispatch table or polymorphism",
        messages: {
            conditionalDispatch:
                "This if/else chain branches {{count}} times on '{{discriminant}}' compared to literals — a hardcoded conditional dispatch that must be edited to add a case (an open/closed violation). Replace it with a data-driven dispatch: a lookup table (an object or Map from the '{{discriminant}}' value to a handler) or polymorphism (Strategy), so a new case is a new table entry, not an edited conditional.",
        },
        ruleId: "conditional_dispatch_table",
        schema: [
            {
                additionalProperties: false,
                properties: { threshold: { maximum: 12, minimum: 3, type: "integer" } },
                type: "object",
            },
        ],
    }),
} satisfies Rule.RuleModule;
