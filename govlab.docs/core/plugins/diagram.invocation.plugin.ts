import { CLASS_DEFS, EDGE_BUDGET } from "#configuration/constants/graph.constants";
import type { CodeGraph, CodeNode } from "#types/graph.types";
import {
    DIAGRAM_DESCRIPTIONS,
    DIAGRAM_TITLES,
    KIND_LEGEND,
    flowTitle,
    moreNodes,
} from "#configuration/strings/figure.strings";
import type {
    DiagramKind,
    DiagramSource,
    FlowModelInput,
    FlowPart,
    FlowScope,
    RenderedDiagram,
} from "#types/figure.types";
import type { GraphEdge, GraphModel, GraphNode } from "#types/diagram.types";
import { adjacencyOf, reachableFrom, rootIds, selectWithinEdgeBudget } from "#core/analyzers/invocation.analyzer";
import { classForKind, dedupEdges, shapeForKind, weightForKind } from "#core/converters/diagram.converter";
import { collapseByLabel } from "#core/converters/graph.converter";
import { emitGraph } from "#core/formatters/diagram.formatter";

const MORE_ID = "z_more";
const MIN_FLOW_NODES = 3;
const MIN_REACHABLE = 3;

const graphNodeOf = function graphNodeOf(node: CodeNode): GraphNode {
    return { class: classForKind(node.kind), id: node.id, label: node.label, shape: shapeForKind(node.kind) };
};

const modelNodes = function modelNodes(input: FlowModelInput): GraphNode[] {
    const nodes = input.keptOrder
        .filter((id) => input.keptIds.has(id))
        .flatMap((id) => {
            const node = input.nodeById.get(id);
            return node ? [graphNodeOf(node)] : [];
        });
    return input.truncated > 0 ? [...nodes, { id: MORE_ID, label: moreNodes(input.truncated), shape: "rect" }] : nodes;
};

const modelEdges = function modelEdges(input: FlowModelInput): GraphEdge[] {
    return dedupEdges(
        input.graph.edges
            .filter((edge) => input.keptIds.has(edge.from) && input.keptIds.has(edge.to))
            .map((edge) => ({ from: edge.from, label: edge.label, to: edge.to, weight: weightForKind(edge.kind) })),
    );
};

const buildModel = function buildModel(input: FlowModelInput): GraphModel {
    return {
        accDescr: DIAGRAM_DESCRIPTIONS.flow,
        accTitle: input.accTitle,
        classDefs: [...CLASS_DEFS],
        direction: input.direction,
        edges: modelEdges(input),
        kind: "flowchart",
        nodes: modelNodes(input),
    };
};

const partSources = function partSources(
    order: readonly string[],
    kept: ReadonlySet<string>,
    nodeById: ReadonlyMap<string, CodeNode>,
): DiagramSource[] {
    return order.flatMap((id) => {
        const node = nodeById.get(id);
        return kept.has(id) && node ? [{ file: node.source.file, label: node.label, line: node.source.line }] : [];
    });
};

const flowPart = function flowPart(root: string, scope: FlowScope): FlowPart | null {
    const order = reachableFrom(root, scope.adj);
    if (order.length < MIN_REACHABLE) {
        return null;
    }
    const kept = selectWithinEdgeBudget(order, scope.graph.edges, EDGE_BUDGET);
    const caption = scope.nodeById.get(root)?.label ?? root;
    const model = buildModel({
        accTitle: flowTitle(scope.context.moduleName, caption),
        direction: scope.context.layout.direction,
        graph: scope.graph,
        keptIds: kept,
        keptOrder: order,
        nodeById: scope.nodeById,
        truncated: order.length - kept.size,
    });
    return { part: { caption, mermaid: emitGraph(model) }, sources: partSources(order, kept, scope.nodeById) };
};

const dedupeSources = function dedupeSources(sources: readonly DiagramSource[]): DiagramSource[] {
    const seen = new Set<string>();
    const out: DiagramSource[] = [];
    for (const source of sources) {
        if (!seen.has(source.label)) {
            seen.add(source.label);
            out.push(source);
        }
    }
    return out;
};

const renderFlow = function renderFlow(scope: FlowScope): RenderedDiagram | null {
    const flowParts = rootIds(scope.graph).flatMap((root) => {
        const part = flowPart(root, scope);
        return part === null ? [] : [part];
    });
    if (flowParts.length === 0) {
        return null;
    }
    const sources = dedupeSources(flowParts.flatMap((part) => part.sources));
    const parts = flowParts.map((part) => part.part);
    const [single] = parts;
    if (parts.length === 1 && single) {
        return { legend: KIND_LEGEND, mermaid: single.mermaid, sources };
    }
    return { legend: KIND_LEGEND, mermaid: "", parts, sources };
};

const scopeOf = function scopeOf(context: FlowScope["context"], graph: CodeGraph): FlowScope {
    return { adj: adjacencyOf(graph), context, graph, nodeById: new Map(graph.nodes.map((node) => [node.id, node])) };
};

export const diagram: DiagramKind = {
    appliesTo(context) {
        return context.codeGraph !== null && context.codeGraph.nodes.length >= MIN_FLOW_NODES;
    },
    id: "flow",
    order: 2,
    render(context) {
        if (context.codeGraph === null) {
            return null;
        }
        const graph = collapseByLabel(context.codeGraph);
        return graph.nodes.length === 0 ? null : renderFlow(scopeOf(context, graph));
    },
    title: DIAGRAM_TITLES.flow,
};
