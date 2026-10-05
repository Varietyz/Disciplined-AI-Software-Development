import type { ReasoningRung } from "#types/axis.types";

export type NodeKind = "analysis" | "finding" | "source";

export interface Node {
    id: string;
    kind: NodeKind;
    reasoning: ReasoningRung;
    tags: readonly string[];
    inputs: readonly string[];
}

export interface GraphDict {
    nodes: Node[];
    edges: number;
}
