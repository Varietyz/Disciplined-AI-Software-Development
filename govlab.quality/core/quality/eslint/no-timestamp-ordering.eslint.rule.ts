import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

const ORDERING_OPERATORS = new Set<string>(["<", ">", "<=", ">=", "-"]);
const FUNCTION_TYPES = new Set<string>(["ArrowFunctionExpression", "FunctionExpression"]);
const CURRENT_TIME_NAMES = new Set<string>([
    "now",
    "nowMs",
    "nowTime",
    "currentTime",
    "currentMs",
    "today",
    "clock",
    "at",
    "asOf",
]);

const STORED = "stored";
const CURRENT = "current";

type InstantKind = typeof CURRENT | typeof STORED | null;

interface AstNode {
    type: string;
    name?: string;
    operator?: string;
    callee?: AstNode;
    object?: AstNode;
    property?: AstNode;
    left?: AstNode;
    right?: AstNode;
    init?: AstNode;
}

const isAstNode = function isAstNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isAstNode(value) ? value : null;
};

const inSortComparator = function inSortComparator(ancestors: AstNode[]): boolean {
    for (let i = ancestors.length - 1; i >= 0; i -= 1) {
        const node = ancestors[i];
        if (node && FUNCTION_TYPES.has(node.type)) {
            if (i === 0) {
                return false;
            }
            const parent = ancestors[i - 1];
            return (
                parent?.type === "CallExpression" &&
                parent.callee?.type === "MemberExpression" &&
                parent.callee.property?.name === "sort"
            );
        }
    }
    return false;
};

const isDateNowCall = function isDateNowCall(callee: AstNode): boolean {
    return callee.object?.type === "Identifier" && callee.object.name === "Date" && callee.property?.name === "now";
};

const namesCurrentTime = function namesCurrentTime(receiver: AstNode | undefined): boolean {
    return (
        receiver?.type === "Identifier" && typeof receiver.name === "string" && CURRENT_TIME_NAMES.has(receiver.name)
    );
};

const callInstantKind = function callInstantKind(node: AstNode): InstantKind {
    const { callee } = node;
    if (callee?.type !== "MemberExpression") {
        return null;
    }
    if (isDateNowCall(callee)) {
        return CURRENT;
    }
    if (callee.property?.name !== "getTime") {
        return null;
    }
    return namesCurrentTime(callee.object) ? CURRENT : STORED;
};

const definitionInit = function definitionInit(
    context: Rule.RuleContext,
    node: Rule.Node,
    name: string,
): AstNode | null {
    let scope: ReturnType<Rule.RuleContext["sourceCode"]["getScope"]> | null = context.sourceCode.getScope(node);
    while (scope) {
        const variable = scope.variables.find((candidate) => candidate.name === name);
        if (variable) {
            if (
                variable.defs.length !== 1 ||
                variable.references.filter((reference) => reference.isWrite()).length > 1
            ) {
                return null;
            }
            return asNode(variable.defs[0]?.node)?.init ?? null;
        }
        scope = scope.upper;
    }
    return null;
};

const instantKind = function instantKind(
    context: Rule.RuleContext,
    node: Rule.Node,
    operand: AstNode | undefined,
): InstantKind {
    if (!operand) {
        return null;
    }
    if (operand.type === "CallExpression") {
        return callInstantKind(operand);
    }
    if (operand.type !== "Identifier" || typeof operand.name !== "string") {
        return null;
    }
    if (CURRENT_TIME_NAMES.has(operand.name)) {
        return CURRENT;
    }
    const init = definitionInit(context, node, operand.name);
    return init?.type === "CallExpression" ? callInstantKind(init) : null;
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onBinary = (node: Rule.Node): void => {
            const binary = asNode(node);
            if (binary === null || typeof binary.operator !== "string" || !ORDERING_OPERATORS.has(binary.operator)) {
                return;
            }
            if (
                instantKind(context, node, binary.left) !== STORED ||
                instantKind(context, node, binary.right) !== STORED
            ) {
                return;
            }
            if (
                binary.operator === "-" &&
                !inSortComparator(context.sourceCode.getAncestors(node).map((a) => asNode(a) ?? { type: "" }))
            ) {
                return;
            }
            context.report({ messageId: "timestampOrdering", node });
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["BinaryExpression", onBinary]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["ordinal-time"],
        description:
            "Disallow ordering two recorded instants against each other — mandate a logical ordinal sequence instead",
        messages: {
            timestampOrdering:
                "This orders two recorded instants against each other — order that depends on physical clocks (skew, non-monotonicity) rather than causality. Assign a monotonic ordinal (a logical sequence number) when the event is recorded and order by that. Comparing a stored deadline against the current time is a different concern and is not reported.",
        },
        ruleId: "timestamp_ordering",
    }),
} satisfies Rule.RuleModule;
