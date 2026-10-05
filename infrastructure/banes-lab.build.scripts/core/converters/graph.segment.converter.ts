import type { ChunkNode, ChunkTarget, GraphChunk, GraphNode } from "@banes-lab/web/types/graph.types.js";
import type { ChunkRules, Graph } from "#types/graph.types";

const targetOf = function targetOf(node: GraphNode): ChunkTarget {
    return { href: node.href, number: node.number, title: node.title };
};

const containersOf = function containersOf(graph: Graph, rules: ChunkRules): ReadonlyMap<string, string> {
    return new Map(
        graph.edges.filter((edge) => edge.relation === rules.contains).map((edge) => [edge.to, edge.from] as const),
    );
};

export const chunksOf = function chunksOf(graph: Graph, rules: ChunkRules): ReadonlyMap<string, GraphChunk> {
    const nodes = new Map(graph.nodes.map((node) => [node.ref, node]));
    const containers = containersOf(graph, rules);
    const relations = new Map<string, Map<string, ChunkTarget[]>>();
    const add = function add(from: string, relation: string, to: string): void {
        const target = nodes.get(to);
        if (!nodes.has(from) || target === undefined || !rules.keptRelations.has(relation)) {
            return;
        }
        const held = relations.get(from) ?? new Map<string, ChunkTarget[]>();
        held.set(relation, [...(held.get(relation) ?? []), targetOf(target)]);
        relations.set(from, held);
    };
    for (const edge of graph.edges.filter((held) => !rules.skipsSource(held.from))) {
        add(edge.from, edge.relation, edge.to);
        const reverse = rules.pairs.find((pair) => pair.forward === edge.relation)?.reverse;
        if (reverse !== undefined) {
            add(edge.to, reverse, edge.from);
        }
        const container = containers.get(edge.to);
        if (reverse !== undefined && container !== undefined && rules.rollsUp.has(reverse)) {
            add(container, reverse, edge.from);
        }
    }
    const chunks = new Map<string, Record<string, ChunkNode>>();
    for (const [ref, held] of relations) {
        const node = nodes.get(ref);
        if (node !== undefined) {
            const key = rules.keyOf(ref);
            const chunk = chunks.get(key) ?? {};
            chunk[ref] = {
                kind: node.kind,
                number: node.number,
                relations: [...held].map(([relation, targets]) => ({ relation, targets })),
                title: node.title,
            };
            chunks.set(key, chunk);
        }
    }
    return chunks;
};
