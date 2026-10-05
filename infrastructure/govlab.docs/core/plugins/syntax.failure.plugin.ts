import { GRAPH_LABELS } from "#configuration/strings/graph.strings";
import type { Recognizer } from "#types/code.types";
import ts from "typescript";

const SINK_SUFFIX = "_fail";

export const recognizer: Recognizer = {
    classify(node, context) {
        if (!ts.isThrowStatement(node)) {
            return null;
        }
        const gateId = context.mkNodeId(node);
        const sinkId = `${gateId}${SINK_SUFFIX}`;
        const source = context.sourceOf(node);
        return {
            edges: [
                { from: context.currentId, kind: "branch", to: gateId },
                { from: gateId, kind: "branch", label: GRAPH_LABELS.fails, to: sinkId },
            ],
            nodes: [
                { id: gateId, kind: "gate", label: GRAPH_LABELS.guard, source },
                { id: sinkId, kind: "fail-sink", label: GRAPH_LABELS.throws, source },
            ],
        };
    },
    emits: { edges: ["branch"], nodes: ["gate", "fail-sink"] },
    name: "gate-throw",
};
