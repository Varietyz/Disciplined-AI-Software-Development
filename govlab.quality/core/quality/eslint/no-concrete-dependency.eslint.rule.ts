import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

const VALUE_BUILTINS = new Set<string>([
    "Map",
    "Set",
    "WeakMap",
    "WeakSet",
    "Date",
    "Array",
    "Object",
    "Promise",
    "Error",
    "RegExp",
    "URL",
    "URLSearchParams",
    "ArrayBuffer",
    "DataView",
    "AbortController",
    "EventTarget",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array",
]);

interface AstNode {
    type: string;
    name?: string;
    left?: AstNode;
    right?: AstNode;
    object?: AstNode;
    callee?: AstNode;
    value?: AstNode | null;
}

const isAstNode = function isAstNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isAstNode(value) ? value : null;
};

const concreteName = function concreteName(valueNode: AstNode | null | undefined): string | null {
    if (valueNode?.type !== "NewExpression") {
        return null;
    }
    const { callee } = valueNode;
    if (callee?.type !== "Identifier" || typeof callee.name !== "string") {
        return null;
    }
    if (VALUE_BUILTINS.has(callee.name)) {
        return null;
    }
    return callee.name;
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const report = function report(name: string | null, node: Rule.Node): void {
            if (name !== null) {
                context.report({ data: { name }, messageId: "concreteDependency", node });
            }
        };
        const onAssign = (node: Rule.Node): void => {
            const assign = asNode(node);
            const left = assign?.left;
            if (left?.type === "MemberExpression" && left.object?.type === "ThisExpression") {
                report(concreteName(assign?.right), node);
            }
        };
        const onPropDef = (node: Rule.Node): void => {
            report(concreteName(asNode(node)?.value), node);
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["AssignmentExpression", onAssign],
            ["PropertyDefinition", onPropDef],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["concrete-coupling"],
        description: "Disallow constructing a concrete dependency as a class field — mandate injecting the abstraction",
        messages: {
            concreteDependency:
                "This class field is bound to `new {{name}}()` — a concrete dependency hardcoded into the class (concrete coupling), so it cannot be substituted or the class tested in isolation. Accept `{{name}}`'s interface as a constructor parameter and inject it.",
        },
        ruleId: "concrete_dependency",
    }),
} satisfies Rule.RuleModule;
