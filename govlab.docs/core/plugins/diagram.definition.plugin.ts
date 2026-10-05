import type { ClassBox, ClassModel, ClassRelation, ClassRelationKind } from "#types/diagram.types";
import {
    DIAGRAM_DESCRIPTIONS,
    DIAGRAM_LEGENDS,
    DIAGRAM_TITLES,
    typeRelationshipTitle,
} from "#configuration/strings/figure.strings";
import type { DiagramContext, DiagramKind, DiagramSource } from "#types/figure.types";
import type { TypeEdge, TypeGraph, TypeNode } from "#types/graph.types";
import { emitClassDiagram } from "#core/formatters/diagram.structure.formatter";

const MIN_EDGES = 1;

const RELATION_KIND: ReadonlyMap<TypeEdge["kind"], ClassRelationKind> = new Map<TypeEdge["kind"], ClassRelationKind>([
    ["extends", "realization"],
    ["implements", "realization"],
    ["has", "aggregation"],
    ["uses", "dependency"],
]);

const connectedIds = function connectedIds(graph: TypeGraph): Set<string> {
    return new Set(graph.edges.flatMap((edge) => [edge.from, edge.to]));
};

const classBoxes = function classBoxes(nodes: readonly TypeNode[], keep: ReadonlySet<string>): ClassBox[] {
    return nodes
        .filter((node) => keep.has(node.id))
        .map((node) => ({ id: node.id, label: node.label, members: node.members.map((name) => ({ name })) }));
};

const classRelations = function classRelations(edges: readonly TypeEdge[]): ClassRelation[] {
    return edges.flatMap((edge) => {
        const kind = RELATION_KIND.get(edge.kind);
        return kind === undefined ? [] : [{ from: edge.from, kind, to: edge.to }];
    });
};

const sourcesOf = function sourcesOf(nodes: readonly TypeNode[], keep: ReadonlySet<string>): DiagramSource[] {
    return nodes
        .filter((node) => keep.has(node.id))
        .map((node) => ({ file: node.source.file, label: node.label, line: node.source.line }));
};

const buildModel = function buildModel(
    context: DiagramContext,
    graph: TypeGraph,
    keep: ReadonlySet<string>,
): ClassModel {
    return {
        accDescr: DIAGRAM_DESCRIPTIONS.typeRelationship,
        accTitle: typeRelationshipTitle(context.moduleName),
        classes: classBoxes(graph.nodes, keep),
        relations: classRelations(graph.edges),
    };
};

export const diagram: DiagramKind = {
    appliesTo(context) {
        return (context.typeGraph?.edges.length ?? 0) >= MIN_EDGES;
    },
    id: "type-relationship",
    order: 5,
    render(context) {
        const graph = context.typeGraph;
        if (!graph || graph.edges.length < MIN_EDGES) {
            return null;
        }
        const keep = connectedIds(graph);
        if (keep.size === 0) {
            return null;
        }
        return {
            legend: DIAGRAM_LEGENDS.typeRelationship,
            mermaid: emitClassDiagram(buildModel(context, graph, keep)),
            sources: sourcesOf(graph.nodes, keep),
        };
    },
    title: DIAGRAM_TITLES.typeRelationship,
};
