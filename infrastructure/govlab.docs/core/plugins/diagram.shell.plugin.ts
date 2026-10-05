import {
    DIAGRAM_DESCRIPTIONS,
    DIAGRAM_LEGENDS,
    DIAGRAM_TITLES,
    lifecycleTitle,
} from "#configuration/strings/figure.strings";
import type { GraphEdge, GraphNode, NodeShape } from "#types/diagram.types";
import type { ScriptNode, ScriptNodeKind } from "#types/graph.types";
import { CLASS_DEFS } from "#configuration/constants/graph.constants";
import type { DiagramKind } from "#types/figure.types";
import { emitGraph } from "#core/formatters/diagram.formatter";
import { scriptLifecycle } from "#core/converters/package.converter";

const CLASS_BY_SCRIPT_KIND: ReadonlyMap<ScriptNodeKind, string> = new Map<ScriptNodeKind, string>([
    ["script", "kEntry"],
    ["tool", "kCollab"],
    ["file", "kState"],
]);

const SHAPE_BY_SCRIPT_KIND: ReadonlyMap<ScriptNodeKind, NodeShape> = new Map<ScriptNodeKind, NodeShape>([
    ["script", "rect"],
    ["tool", "collaborator"],
    ["file", "rect"],
]);

const lifecycleNode = function lifecycleNode(node: ScriptNode): GraphNode {
    return {
        class: CLASS_BY_SCRIPT_KIND.get(node.kind) ?? "kState",
        id: node.id,
        label: node.label,
        shape: SHAPE_BY_SCRIPT_KIND.get(node.kind) ?? "rect",
    };
};

export const diagram: DiagramKind = {
    appliesTo(context) {
        return Object.keys(context.scripts ?? {}).length > 0;
    },
    id: "lifecycle",
    order: 0,
    render(context) {
        if (!context.scripts || Object.keys(context.scripts).length === 0) {
            return null;
        }
        const graph = scriptLifecycle(context.scripts);
        if (graph.edges.length === 0) {
            return null;
        }
        const edges: GraphEdge[] = graph.edges.map((edge) => ({ from: edge.from, to: edge.to, weight: "call" }));
        return {
            legend: DIAGRAM_LEGENDS.lifecycle,
            mermaid: emitGraph({
                accDescr: DIAGRAM_DESCRIPTIONS.lifecycle,
                accTitle: lifecycleTitle(context.moduleName),
                classDefs: [...CLASS_DEFS],
                direction: "TD",
                edges,
                kind: "flowchart",
                nodes: graph.nodes.map(lifecycleNode),
            }),
            sources: [],
        };
    },
    title: DIAGRAM_TITLES.lifecycle,
};
