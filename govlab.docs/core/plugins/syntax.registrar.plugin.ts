import type { Recognizer } from "#types/code.types";
import ts from "typescript";

const DEFINE = "define";
const SET_METHOD = "set";
const SET_SUFFIX = ".set";
const DEFAULT_SET_LABEL = "registry.set";

const isDefineName = function isDefineName(name: string): boolean {
    return name.startsWith(DEFINE) && name.length > DEFINE.length;
};

const labelOf = function labelOf(node: ts.CallExpression): string | null {
    const callee = node.expression;
    if (ts.isPropertyAccessExpression(callee) && callee.name.text === SET_METHOD) {
        return ts.isIdentifier(callee.expression) ? `${callee.expression.text}${SET_SUFFIX}` : DEFAULT_SET_LABEL;
    }
    return ts.isIdentifier(callee) && isDefineName(callee.text) ? callee.text : null;
};

export const recognizer: Recognizer = {
    classify(node, context) {
        const registered = ts.isCallExpression(node) ? labelOf(node) : null;
        if (registered === null) {
            return null;
        }
        const id = context.mkNodeId(node);
        return { edges: [], nodes: [{ id, kind: "registry", label: registered, source: context.sourceOf(node) }] };
    },
    emits: { edges: [], nodes: ["registry"] },
    name: "registry-define",
};
