import type { CanonicalNodes, CodeEdge, CodeGraph, CodeNode } from "#types/graph.types";
import type { GraphEdge, GraphModel, GraphNode, ModuleDep } from "#types/diagram.types";

const canonicalizeNodes = function canonicalizeNodes(graph: CodeGraph): CanonicalNodes {
    const canon = new Map<string, string>();
    const idMap = new Map<string, string>();
    const nodes: CodeNode[] = [];
    for (const node of graph.nodes.toSorted((left, right) => left.id.localeCompare(right.id))) {
        const key = `${node.kind} ${node.label}`;
        const existing = canon.get(key);
        idMap.set(node.id, existing ?? node.id);
        if (existing === undefined) {
            canon.set(key, node.id);
            nodes.push(node);
        }
    }
    return { idMap, nodes };
};

const dedupeEdges = function dedupeEdges(edges: readonly CodeEdge[], idMap: ReadonlyMap<string, string>): CodeEdge[] {
    const byKey = new Map<string, CodeEdge>();
    for (const edge of edges) {
        const from = idMap.get(edge.from) ?? edge.from;
        const to = idMap.get(edge.to) ?? edge.to;
        const key = `${from} ${to} ${edge.kind} ${edge.label ?? ""}`;
        if (from !== to && !byKey.has(key)) {
            byKey.set(key, { from, kind: edge.kind, label: edge.label, to });
        }
    }
    return [...byKey.values()];
};

export const collapseByLabel = function collapseByLabel(graph: CodeGraph): CodeGraph {
    const { idMap, nodes } = canonicalizeNodes(graph);
    return { edges: dedupeEdges(graph.edges, idMap), nodes };
};

const shortName = function shortName(name: string): string {
    const slash = name.lastIndexOf("/");
    return slash === -1 ? name : name.slice(slash + 1);
};

const presentEdges = function presentEdges(modules: readonly ModuleDep[], present: ReadonlySet<string>): GraphEdge[] {
    return modules.flatMap((module) =>
        module.deps
            .filter((dep) => present.has(dep))
            .map((dep) => ({ from: module.name, to: dep, weight: "dependency" as const })),
    );
};

export const depGraphOf = function depGraphOf(modules: readonly ModuleDep[], keepIsolated = false): GraphModel {
    const present = new Set(modules.map((module) => module.name));
    const edges = presentEdges(modules, present);
    const connected = new Set(edges.flatMap((edge) => [edge.from, edge.to]));
    const nodes: GraphNode[] = modules
        .filter((module) => keepIsolated || connected.has(module.name))
        .map((module) => ({ id: module.name, label: shortName(module.name) }));
    return { direction: "TD", edges, kind: "graph", nodes };
};
