import { CLASS_DEFS, EDGE_BUDGET } from "#configuration/constants/graph.constants";
import type { CappedEdges, CappedGraph, CodeEdge, CodeGraph, CodeNode } from "#types/graph.types";
import {
    DIAGRAM_DESCRIPTIONS,
    DIAGRAM_LEGENDS,
    DIAGRAM_TITLES,
    KIND_LEGEND,
    dataFlowTitle,
    truncationNote,
} from "#configuration/strings/figure.strings";
import type { DiagramContext, DiagramKind, DiagramSource } from "#types/figure.types";
import type { GraphEdge, GraphModel, GraphNode } from "#types/diagram.types";
import { classForKind, dedupEdges, shapeForKind, weightForKind } from "#core/converters/diagram.converter";
import { collapseByLabel } from "#core/converters/graph.converter";
import { emitGraph } from "#core/formatters/diagram.formatter";

const MIN_DATA_EDGES = 2;
const DATA_KINDS: ReadonlySet<CodeEdge["kind"]> = new Set<CodeEdge["kind"]>(["data-flow", "dependency"]);

const edgeKey = function edgeKey(edge: CodeEdge): string {
    return `${edge.from} ${edge.to} ${edge.label ?? ""}`;
};

const dataEdges = function dataEdges(graph: CodeGraph): CodeEdge[] {
    return graph.edges.filter((edge) => DATA_KINDS.has(edge.kind));
};

const capEdges = function capEdges(edges: readonly CodeEdge[]): CappedEdges {
    if (edges.length <= EDGE_BUDGET) {
        return { edges: [...edges], truncated: false };
    }
    const sorted = edges.toSorted((left, right) => edgeKey(left).localeCompare(edgeKey(right)));
    return { edges: sorted.slice(0, EDGE_BUDGET), truncated: true };
};

const involvedNodes = function involvedNodes(
    edges: readonly CodeEdge[],
    nodeById: ReadonlyMap<string, CodeNode>,
): CodeNode[] {
    const ids = new Set(edges.flatMap((edge) => [edge.from, edge.to]));
    return [...ids]
        .flatMap((id) => {
            const node = nodeById.get(id);
            return node ? [node] : [];
        })
        .toSorted((left, right) => left.id.localeCompare(right.id));
};

const modelNodes = function modelNodes(nodes: readonly CodeNode[]): GraphNode[] {
    return nodes.map((node) => ({
        class: classForKind(node.kind),
        id: node.id,
        label: node.label,
        shape: shapeForKind(node.kind),
    }));
};

const modelEdges = function modelEdges(edges: readonly CodeEdge[]): GraphEdge[] {
    return dedupEdges(
        edges.map((edge) => ({ from: edge.from, label: edge.label, to: edge.to, weight: weightForKind(edge.kind) })),
    );
};

const sourcesOf = function sourcesOf(nodes: readonly CodeNode[]): DiagramSource[] {
    return nodes.map((node) => ({ file: node.source.file, label: node.label, line: node.source.line }));
};

const cappedDataNodes = function cappedDataNodes(graph: CodeGraph): CappedGraph {
    const allEdges = dataEdges(graph);
    const { edges, truncated } = capEdges(allEdges);
    const nodes = involvedNodes(edges, new Map(graph.nodes.map((node) => [node.id, node])));
    return { allCount: allEdges.length, edges, nodes, truncated };
};

const buildModel = function buildModel(context: DiagramContext, capped: CappedGraph): GraphModel {
    return {
        accDescr: DIAGRAM_DESCRIPTIONS.dataFlow,
        accTitle: dataFlowTitle(context.moduleName),
        classDefs: [...CLASS_DEFS],
        direction: context.layout.direction,
        edges: modelEdges(capped.edges),
        kind: "flowchart",
        nodes: modelNodes(capped.nodes),
    };
};

export const diagram: DiagramKind = {
    appliesTo(context) {
        return context.codeGraph !== null && dataEdges(context.codeGraph).length >= MIN_DATA_EDGES;
    },
    id: "data-flow",
    order: 4,
    render(context) {
        if (context.codeGraph === null) {
            return null;
        }
        const capped = cappedDataNodes(collapseByLabel(context.codeGraph));
        if (capped.allCount < MIN_DATA_EDGES || capped.nodes.length === 0) {
            return null;
        }
        const note = capped.truncated ? [truncationNote(EDGE_BUDGET, capped.allCount)] : [];
        return {
            legend: [DIAGRAM_LEGENDS.dataFlow, ...KIND_LEGEND, ...note],
            mermaid: emitGraph(buildModel(context, capped)),
            sources: sourcesOf(capped.nodes),
        };
    },
    title: DIAGRAM_TITLES.dataFlow,
};
