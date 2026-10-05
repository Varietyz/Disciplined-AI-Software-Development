import type { CodeEdge, CodeGraph } from "#types/graph.types";

const byId = function byId(left: string, right: string): number {
    return left.localeCompare(right);
};

export const adjacencyOf = function adjacencyOf(graph: CodeGraph): Map<string, string[]> {
    const adjacency = new Map<string, string[]>();
    for (const edge of graph.edges) {
        adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), edge.to]);
    }
    return adjacency;
};

export const reachableFrom = function reachableFrom(root: string, adjacency: ReadonlyMap<string, string[]>): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const stack = [root];
    let id = stack.pop();
    while (id !== undefined) {
        if (!visited.has(id)) {
            visited.add(id);
            order.push(id);
            stack.push(...(adjacency.get(id) ?? []).toSorted(byId).toReversed());
        }
        id = stack.pop();
    }
    return order;
};

const incidentKeptEdges = function incidentKeptEdges(
    id: string,
    edges: readonly CodeEdge[],
    kept: ReadonlySet<string>,
): number {
    return edges.filter((edge) => (edge.from === id && kept.has(edge.to)) || (edge.to === id && kept.has(edge.from)))
        .length;
};

export const selectWithinEdgeBudget = function selectWithinEdgeBudget(
    order: readonly string[],
    edges: readonly CodeEdge[],
    budget: number,
): Set<string> {
    const kept = new Set<string>();
    let edgeCount = 0;
    for (const id of order) {
        const added = incidentKeptEdges(id, edges, kept);
        if (edgeCount + added > budget) {
            return kept;
        }
        kept.add(id);
        edgeCount += added;
    }
    return kept;
};

export const rootIds = function rootIds(graph: CodeGraph): string[] {
    const roots = graph.nodes
        .filter((node) => node.kind === "entry" || node.kind === "factory")
        .map((node) => node.id)
        .toSorted(byId);
    if (roots.length > 0) {
        return roots;
    }
    const [first] = graph.nodes.toSorted((left, right) => byId(left.id, right.id));
    return first ? [first.id] : [];
};
