import { GRAPH_LABELS } from "#configuration/strings/graph.strings";
import type { Recognizer } from "#types/code.types";
import ts from "typescript";

export const recognizer: Recognizer = {
    classify(node, context) {
        if (!ts.isBinaryExpression(node) || node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
            return null;
        }
        if (!ts.isPropertyAccessExpression(node.left)) {
            return null;
        }
        const id = context.mkNodeId(node);
        return {
            edges: [{ from: context.currentId, kind: "data-flow", label: GRAPH_LABELS.writes, to: id }],
            nodes: [{ id, kind: "store", label: node.left.name.text, source: context.sourceOf(node) }],
        };
    },
    emits: { edges: ["data-flow"], nodes: ["store"] },
    name: "store",
};
