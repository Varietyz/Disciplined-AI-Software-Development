export type NodeShape = "collaborator" | "decision" | "endpoint" | "rect" | "store";
export type EdgeWeight = "branch" | "call" | "dependency" | "hook" | "teardown";

export interface GraphNode {
    id: string;
    label: string;
    shape?: NodeShape;
    class?: string;
}

export interface GraphEdge {
    from: string;
    to: string;
    label?: string | undefined;
    weight?: EdgeWeight | undefined;
}

export interface GraphSubgraph {
    id: string;
    title: string;
    nodeIds: string[];
}

export interface ClassDef {
    name: string;
    stroke: string;
}

export interface AccessibleText {
    accTitle?: string;
    accDescr?: string;
}

export interface GraphModel extends AccessibleText {
    kind: "flowchart" | "graph";
    direction: "LR" | "TB" | "TD";
    nodes: GraphNode[];
    edges: GraphEdge[];
    subgraphs?: GraphSubgraph[];
    classDefs?: ClassDef[];
}

export interface ModuleDep {
    name: string;
    deps: string[];
}

export type MessageKind = "async" | "return" | "sync";

export interface SequenceParticipant {
    id: string;
    label: string;
}

export interface SequenceMessage {
    from: string;
    to: string;
    text: string;
    kind: MessageKind;
}

export interface SequenceNote {
    over: string[];
    text: string;
}

export interface SequenceStep {
    message?: SequenceMessage;
    note?: SequenceNote;
}

export interface SequenceModel extends AccessibleText {
    participants: SequenceParticipant[];
    steps: SequenceStep[];
    autonumber?: boolean;
}

export type ClassRelationKind = "aggregation" | "composition" | "dependency" | "realization";

export interface ClassMember {
    name: string;
}

export interface ClassBox {
    id: string;
    label: string;
    members: ClassMember[];
}

export interface ClassRelation {
    from: string;
    to: string;
    kind: ClassRelationKind;
    label?: string | undefined;
}

export interface ClassModel extends AccessibleText {
    classes: ClassBox[];
    relations: ClassRelation[];
}

export interface StateNode {
    id: string;
    label: string;
}

export interface StateTransition {
    from: string;
    to: string;
    label?: string | undefined;
}

export interface StateModel extends AccessibleText {
    initial?: string;
    nodes: StateNode[];
    transitions: StateTransition[];
}

export interface MermaidBlock {
    startLine: number;
    code: string;
}

export type MermaidHardeningCode =
    | "mermaid-html-break"
    | "mermaid-label-reserved"
    | "mermaid-non-ascii"
    | "mermaid-paren"
    | "mermaid-semicolon"
    | "mermaid-subgraph-direction";

export interface MermaidHardeningHit {
    code: MermaidHardeningCode;
    line: number;
    col: number;
    detail: string;
}

export type MermaidParser =
    { available: false; reason: string } | { available: true; parse: (code: string) => Promise<string | null> };

export interface AvailableParser {
    parse: (code: string) => Promise<string | null>;
}

export interface ChartFinding {
    line: number;
    message: string;
}

export interface ChartReport {
    available: boolean;
    findings: ChartFinding[];
    reason?: string;
}

export interface ChartChecker {
    check: (source: string) => Promise<ChartFinding[]>;
}

export type NodeEntry = [string, GraphNode];

export interface FlowchartSpec extends AccessibleText {
    direction: GraphModel["direction"];
    edges: GraphEdge[];
    nodeEntries: NodeEntry[];
    subgraphs?: GraphSubgraph[];
}
