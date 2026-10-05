import type { Rule, Scope } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";
import type ts from "typescript";

const MUTATORS = new Set<string>([
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse",
    "fill",
    "copyWithin",
]);

interface MemberNode {
    type: string;
    computed?: boolean;
    object?: MemberNode;
    property?: { name?: string };
    name?: string;
}

const isMember = function isMember(value: unknown): value is MemberNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asMember = function asMember(value: unknown): MemberNode | null {
    return isMember(value) ? value : null;
};

const rootIdentifier = function rootIdentifier(node: MemberNode | null): MemberNode | null {
    let current = node;
    while (current?.type === "MemberExpression") {
        current = current.object ?? null;
    }
    return current?.type === "Identifier" ? current : null;
};

const resolvesToParameter = function resolvesToParameter(scope: Scope.Scope | null, name: string): boolean {
    let current: Scope.Scope | null = scope;
    while (current) {
        const variable = current.variables.find((entry) => entry.name === name);
        if (variable) {
            return variable.defs.some((def) => def.type === "Parameter");
        }
        current = current.upper;
    }
    return false;
};

interface TypedParserServices {
    esTreeNodeToTSNodeMap: { get: (node: unknown) => ts.Node | undefined };
    program: ts.Program;
}

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const isTypedServices = function isTypedServices(value: unknown): value is TypedParserServices {
    if (!isRecord(value)) {
        return false;
    }
    const { esTreeNodeToTSNodeMap: nodeMap, program } = value;
    const mapsNodes = isRecord(nodeMap) && typeof nodeMap["get"] === "function";
    return mapsNodes && isRecord(program) && typeof program["getTypeChecker"] === "function";
};

const isArrayLikeReceiver = function isArrayLikeReceiver(context: Rule.RuleContext, receiver: unknown): boolean {
    const services: unknown = context.sourceCode.parserServices;
    if (!isTypedServices(services)) {
        return true;
    }
    const tsNode = services.esTreeNodeToTSNodeMap.get(receiver);
    if (tsNode === undefined) {
        return true;
    }
    const checker = services.program.getTypeChecker();
    const type: ts.Type = checker.getTypeAtLocation(tsNode);
    const parts: ts.Type[] = type.isUnion() ? type.types : [type];
    return parts.some((part) => checker.isArrayType(part) || checker.isTupleType(part));
};

const mutatedParam = function mutatedParam(
    context: Rule.RuleContext,
    node: Rule.Node,
): { method: string; name: string } | null {
    if (node.type !== "CallExpression" || node.callee.type !== "MemberExpression" || node.callee.computed) {
        return null;
    }
    const { callee } = node;
    const method = callee.property.type === "Identifier" ? callee.property.name : "";
    if (!MUTATORS.has(method)) {
        return null;
    }
    if (!isArrayLikeReceiver(context, callee.object)) {
        return null;
    }
    const root = rootIdentifier(asMember(callee.object));
    if (root === null || typeof root.name !== "string") {
        return null;
    }
    return resolvesToParameter(context.sourceCode.getScope(node), root.name) ? { method, name: root.name } : null;
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onCall = (node: Rule.Node): void => {
            const hit = mutatedParam(context, node);
            if (hit !== null) {
                context.report({ data: hit, messageId: "mutableParam", node });
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["CallExpression", onCall]];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["immutability"],
        description: "Disallow mutating a function parameter (or its members) in place — mandate returning new data",
        messages: {
            mutableParam:
                "This mutates the parameter `{{name}}` in place via `.{{method}}()` — a caller's data is changed as a side effect and the transform is not reproducible. Build and return a new value ({ ...input, items: [...input.items, added] }) and type the parameter readonly.",
        },
        ruleId: "no_mutable_parameter",
    }),
} satisfies Rule.RuleModule;
