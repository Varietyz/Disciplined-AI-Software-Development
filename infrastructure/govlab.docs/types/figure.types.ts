import type { CodeGraph, CodeNode, TypeGraph } from "#types/graph.types";
import type { ModuleDep } from "#types/diagram.types";

export type PackageShape = "framework" | "full-stack" | "leaf";

export interface LayoutPolicy {
    direction: "LR" | "TD";
    nodeCap: number;
    cluster: boolean;
    perAxis: boolean;
}

export interface DiagramSource {
    label: string;
    file: string;
    line: number;
}

export interface RenderedPart {
    caption: string;
    mermaid: string;
}

export interface RenderedDiagram {
    mermaid: string;
    legend: readonly string[];
    sources: DiagramSource[];
    parts?: RenderedPart[];
}

export interface DiagramContext {
    moduleName: string;
    shape: PackageShape;
    layout: LayoutPolicy;
    codeGraph: CodeGraph | null;
    typeGraph?: TypeGraph | null | undefined;
    moduleDeps: ModuleDep[];
    keepIsolated?: boolean;
    scripts?: Record<string, string>;
}

export interface DiagramKind {
    id: string;
    order: number;
    title: string;
    appliesTo: (context: DiagramContext) => boolean;
    render: (context: DiagramContext) => RenderedDiagram | null;
}

export interface Charts {
    content: string;
    path: string;
}

export interface FlowScope {
    context: DiagramContext;
    graph: CodeGraph;
    adj: Map<string, string[]>;
    nodeById: Map<string, CodeNode>;
}

export interface FlowModelInput {
    keptIds: Set<string>;
    keptOrder: string[];
    graph: CodeGraph;
    nodeById: Map<string, CodeNode>;
    direction: "LR" | "TD";
    accTitle: string;
    truncated: number;
}

export interface FlowPart {
    part: RenderedPart;
    sources: DiagramSource[];
}

export interface WorkspaceRow {
    deps: string[];
    group: string;
    maturity: string;
    name: string;
}
