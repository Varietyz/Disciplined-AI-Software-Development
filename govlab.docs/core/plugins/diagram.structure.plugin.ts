import type { ClassBox, ClassModel, ClassRelation } from "#types/diagram.types";
import type { CodeEdge, CodeNodeKind } from "#types/graph.types";
import {
    DIAGRAM_DESCRIPTIONS,
    DIAGRAM_TITLES,
    KIND_LEGEND,
    structureTitle,
} from "#configuration/strings/figure.strings";
import type { DiagramKind } from "#types/figure.types";
import { collapseByLabel } from "#core/converters/graph.converter";
import { emitClassDiagram } from "#core/formatters/diagram.structure.formatter";

const STRUCT_KINDS: ReadonlySet<CodeNodeKind> = new Set<CodeNodeKind>(["entry", "factory", "collaborator", "registry"]);
const STRUCT_EDGE_KINDS: ReadonlySet<CodeEdge["kind"]> = new Set<CodeEdge["kind"]>(["call", "data-flow"]);
const MIN_STRUCT_NODES = 2;

const isStructEdge = function isStructEdge(edge: CodeEdge, ids: ReadonlySet<string>): boolean {
    return ids.has(edge.from) && ids.has(edge.to) && STRUCT_EDGE_KINDS.has(edge.kind);
};

const structRelations = function structRelations(
    edges: readonly CodeEdge[],
    ids: ReadonlySet<string>,
): ClassRelation[] {
    const byKey = new Map<string, ClassRelation>();
    for (const edge of edges) {
        const key = `${edge.from} ${edge.to}`;
        if (isStructEdge(edge, ids) && !byKey.has(key)) {
            byKey.set(key, { from: edge.from, kind: "aggregation", to: edge.to });
        }
    }
    return [...byKey.values()];
};

export const diagram: DiagramKind = {
    appliesTo(context) {
        return (
            (context.codeGraph?.nodes ?? []).filter((node) => STRUCT_KINDS.has(node.kind)).length >= MIN_STRUCT_NODES
        );
    },
    id: "structure",
    order: 1,
    render(context) {
        if (context.codeGraph === null) {
            return null;
        }
        const graph = collapseByLabel(context.codeGraph);
        const structNodes = graph.nodes.filter((node) => STRUCT_KINDS.has(node.kind));
        const ids = new Set(structNodes.map((node) => node.id));
        const classes: ClassBox[] = structNodes.map((node) => ({ id: node.id, label: node.label, members: [] }));
        const model: ClassModel = {
            accDescr: DIAGRAM_DESCRIPTIONS.structure,
            accTitle: structureTitle(context.moduleName),
            classes,
            relations: structRelations(graph.edges, ids),
        };
        return {
            legend: KIND_LEGEND,
            mermaid: emitClassDiagram(model),
            sources: structNodes.map((node) => ({ file: node.source.file, label: node.label, line: node.source.line })),
        };
    },
    title: DIAGRAM_TITLES.structure,
};
