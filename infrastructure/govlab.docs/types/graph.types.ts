export type CodeNodeKind =
    | "collaborator"
    | "decision"
    | "entry"
    | "exit"
    | "factory"
    | "fail-sink"
    | "gate"
    | "hook"
    | "method"
    | "registry"
    | "store";

export type CodeEdgeKind = "branch" | "call" | "data-flow" | "dependency" | "hook-register" | "loop" | "teardown";

export interface CodeSource {
    file: string;
    line: number;
}

export interface CodeNode {
    id: string;
    kind: CodeNodeKind;
    label: string;
    source: CodeSource;
}

export interface CodeEdge {
    from: string;
    to: string;
    kind: CodeEdgeKind;
    label?: string | undefined;
}

export interface DetectedTransition {
    from: string;
    to: string;
    label?: string | undefined;
}

export interface DetectedState {
    states: string[];
    initial: string | null;
    transitions: DetectedTransition[];
}

export interface DetectedMessage {
    to: string;
    text: string;
    async: boolean;
}

export interface DetectedProtocol {
    self: string;
    participants: string[];
    messages: DetectedMessage[];
}

export interface CodeGraph {
    nodes: CodeNode[];
    edges: CodeEdge[];
    state?: DetectedState | null;
    protocol?: DetectedProtocol | null;
}

export interface CanonicalNodes {
    idMap: Map<string, string>;
    nodes: CodeNode[];
}

export type TypeNodeKind = "class" | "enum" | "interface" | "type-alias";

export type TypeEdgeKind = "extends" | "has" | "implements" | "uses";

export interface TypeNode {
    id: string;
    kind: TypeNodeKind;
    label: string;
    members: string[];
    source: CodeSource;
}

export interface TypeEdge {
    from: string;
    to: string;
    kind: TypeEdgeKind;
    label?: string | undefined;
}

export interface TypeGraph {
    nodes: TypeNode[];
    edges: TypeEdge[];
}

export type ScriptNodeKind = "file" | "script" | "tool";

export interface ScriptNode {
    id: string;
    label: string;
    kind: ScriptNodeKind;
}

export interface ScriptEdge {
    from: string;
    to: string;
}

export interface ScriptGraph {
    nodes: ScriptNode[];
    edges: ScriptEdge[];
}

export interface CappedEdges {
    edges: CodeEdge[];
    truncated: boolean;
}

export interface CappedGraph extends CappedEdges {
    allCount: number;
    nodes: CodeNode[];
}
