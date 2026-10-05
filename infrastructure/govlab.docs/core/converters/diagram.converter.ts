import { CLASS_BY_KIND, DEFAULT_CLASS } from "#configuration/constants/graph.constants";
import type { CodeEdgeKind, CodeNodeKind } from "#types/graph.types";
import type { EdgeWeight, GraphEdge, NodeShape } from "#types/diagram.types";

const ENDPOINT_KINDS: ReadonlySet<CodeNodeKind> = new Set<CodeNodeKind>(["entry", "factory", "exit"]);
const DECISION_KINDS: ReadonlySet<CodeNodeKind> = new Set<CodeNodeKind>(["decision", "gate"]);
const DEPENDENCY_KINDS: ReadonlySet<CodeEdgeKind> = new Set<CodeEdgeKind>(["data-flow", "dependency"]);

export const shapeForKind = function shapeForKind(kind: CodeNodeKind): NodeShape {
    if (ENDPOINT_KINDS.has(kind)) {
        return "endpoint";
    }
    if (kind === "collaborator") {
        return "collaborator";
    }
    if (DECISION_KINDS.has(kind)) {
        return "decision";
    }
    return kind === "store" ? "store" : "rect";
};

export const weightForKind = function weightForKind(kind: CodeEdgeKind): EdgeWeight {
    if (kind === "hook-register") {
        return "hook";
    }
    if (kind === "teardown") {
        return "teardown";
    }
    if (DEPENDENCY_KINDS.has(kind)) {
        return "dependency";
    }
    return kind === "branch" ? "branch" : "call";
};

export const classForKind = function classForKind(kind: CodeNodeKind): string {
    return CLASS_BY_KIND.get(kind) ?? DEFAULT_CLASS;
};

export const dedupEdges = function dedupEdges(edges: readonly GraphEdge[]): GraphEdge[] {
    const byKey = new Map<string, GraphEdge>();
    for (const edge of edges) {
        const key = `${edge.from} ${edge.to} ${edge.weight ?? ""} ${edge.label ?? ""}`;
        if (!byKey.has(key)) {
            byKey.set(key, edge);
        }
    }
    return [...byKey.values()];
};
