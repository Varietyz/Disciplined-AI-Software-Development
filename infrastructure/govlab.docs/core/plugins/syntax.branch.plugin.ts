import type { Recognizer } from "#types/code.types";
import ts from "typescript";

const decisionLabel = function decisionLabel(node: ts.Node): string | null {
    if (ts.isIfStatement(node)) {
        return "if";
    }
    if (ts.isSwitchStatement(node)) {
        return "switch";
    }
    return ts.isConditionalExpression(node) ? "ternary" : null;
};

export const recognizer: Recognizer = {
    classify(node, context) {
        const kind = decisionLabel(node);
        if (kind === null) {
            return null;
        }
        const id = context.mkNodeId(node);
        return {
            edges: [{ from: context.currentId, kind: "branch", to: id }],
            nodes: [{ id, kind: "decision", label: kind, source: context.sourceOf(node) }],
        };
    },
    emits: { edges: ["branch"], nodes: ["decision"] },
    name: "decision",
};
