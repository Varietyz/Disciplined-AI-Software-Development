import type { Recognizer } from "#types/code.types";
import ts from "typescript";

const TEARDOWN_NAMES: ReadonlySet<string> = new Set(["remove", "off", "unsubscribe", "destroy"]);
const TEARDOWN_PREFIXES: readonly string[] = ["cleanup", "teardown", "dispose"];

const isTeardownMethod = function isTeardownMethod(name: string): boolean {
    const lower = name.toLowerCase();
    return TEARDOWN_NAMES.has(lower) || TEARDOWN_PREFIXES.some((prefix) => lower.startsWith(prefix));
};

export const recognizer: Recognizer = {
    classify(node, context) {
        if (!ts.isCallExpression(node) || !ts.isPropertyAccessExpression(node.expression)) {
            return null;
        }
        const method = node.expression.name.text;
        if (!isTeardownMethod(method)) {
            return null;
        }
        const target = node.expression.expression;
        const owner = ts.isIdentifier(target) ? target.text : method;
        const id = context.mkNodeId(node);
        return {
            edges: [{ from: context.currentId, kind: "teardown", label: method, to: id }],
            nodes: [{ id, kind: "collaborator", label: owner, source: context.sourceOf(node) }],
        };
    },
    emits: { edges: ["teardown"], nodes: ["collaborator"] },
    name: "teardown",
};
