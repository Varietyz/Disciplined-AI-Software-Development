import { CONTAINS_RELATION, EVIDENCE_RELATION_ID } from "@banes-lab/web/constants/graph.constants";
import type { EdgeIndex, Graph, Merged } from "#types/graph.types";
import type { GraphEdge, GraphNode, RelationPair } from "@banes-lab/web/types/graph.types.js";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { ReferenceRelation } from "@banes-lab/web/types/reference.types.js";
import { noReverse } from "#configuration/strings/catalog.strings";

export const inboundRelations = function inboundRelations(
    graph: Graph,
    pairs: readonly RelationPair[],
): ReadonlyMap<string, readonly ReferenceRelation[]> {
    const titles = new Map(graph.nodes.map((held) => [held.ref, held.title]));
    const reverses = new Map(pairs.map((pair) => [pair.forward, pair.reverse]));
    const inbound = new Map<string, Map<string, Map<string, string>>>();
    for (const edge of graph.edges) {
        const reverse = reverses.get(edge.relation);
        if (reverse === undefined) {
            throw new Error(noReverse(edge.relation, edge.from));
        }
        const byRelation = inbound.get(edge.to) ?? new Map<string, Map<string, string>>();
        const sources = byRelation.get(reverse) ?? new Map<string, string>();
        sources.set(edge.from, titles.get(edge.from) ?? edge.from);
        byRelation.set(reverse, sources);
        inbound.set(edge.to, byRelation);
    }
    return new Map(
        [...inbound.entries()].map(([ref, byRelation]) => [
            ref,
            [...byRelation.entries()].map(([relation, sources]) => ({
                edges: [...sources.entries()].map(([source, label]) => ({ label, ref: source })),
                relation,
            })),
        ]),
    );
};

export const outboundRelations = function outboundRelations(
    graph: Graph,
): ReadonlyMap<string, readonly ReferenceRelation[]> {
    const titles = new Map(graph.nodes.map((held) => [held.ref, held.title]));
    const outbound = new Map<string, Map<string, Map<string, string>>>();
    for (const edge of graph.edges) {
        const byRelation = outbound.get(edge.from) ?? new Map<string, Map<string, string>>();
        const targets = byRelation.get(edge.relation) ?? new Map<string, string>();
        targets.set(edge.to, titles.get(edge.to) ?? edge.to);
        byRelation.set(edge.relation, targets);
        outbound.set(edge.from, byRelation);
    }
    return new Map(
        [...outbound.entries()].map(([ref, byRelation]) => [
            ref,
            [...byRelation.entries()].map(([relation, targets]) => ({
                edges: [...targets.entries()].map(([target, label]) => ({ label, ref: target })),
                relation,
            })),
        ]),
    );
};

const indexKey = function indexKey(ref: string, relation: string): string {
    return `${ref}\n${relation}`;
};

export const edgeIndexOf = function edgeIndexOf(graph: Graph): EdgeIndex {
    const titles = new Map(graph.nodes.map((held) => [held.ref, held.title]));
    const outgoing = new Map<string, EdgeRef[]>();
    const incoming = new Map<string, EdgeRef[]>();
    const add = function add(into: Map<string, EdgeRef[]>, key: string, ref: string): void {
        into.set(key, [...(into.get(key) ?? []), { label: titles.get(ref) ?? ref, ref }]);
    };
    for (const edge of graph.edges) {
        add(outgoing, indexKey(edge.from, edge.relation), edge.to);
        add(incoming, indexKey(edge.to, edge.relation), edge.from);
    }
    return {
        incoming: (ref, relation) => incoming.get(indexKey(ref, relation)) ?? [],
        outgoing: (ref, relation) => outgoing.get(indexKey(ref, relation)) ?? [],
    };
};

export const groundingSources = function groundingSources(
    graph: Graph,
    edges: EdgeIndex,
    hrefOf: (ref: string) => string | null,
): (ref: string) => readonly EdgeRef[] {
    const sharingHref = new Map<string, string[]>();
    for (const node of graph.nodes) {
        if (node.href !== null) {
            sharingHref.set(node.href, [...(sharingHref.get(node.href) ?? []), node.ref]);
        }
    }
    return (ref) => {
        const href = hrefOf(ref);
        const aliases = href === null ? [] : (sharingHref.get(href) ?? []).filter((alias) => alias !== ref);
        const held = [ref, ...aliases, ...edges.outgoing(ref, CONTAINS_RELATION).map((edge) => edge.ref ?? "")];
        const sources = new Map(
            held.flatMap((part) => edges.incoming(part, EVIDENCE_RELATION_ID)).map((edge) => [edge.ref, edge.label]),
        );
        return [...sources].map(([source, label]) => ({ label, ref: source }));
    };
};

const edgeKey = function edgeKey(edge: GraphEdge): string {
    return `${edge.from}\n${edge.relation}\n${edge.to}`;
};

const isDuplicate = function isDuplicate(kept: GraphNode, held: GraphNode): boolean {
    return kept.kind !== held.kind || kept.layer !== held.layer;
};

export const mergeGraphs = function mergeGraphs(parts: readonly Graph[]): Merged {
    const nodes = new Map<string, GraphNode>();
    const edges = new Map<string, GraphEdge>();
    const duplicates: (readonly [GraphNode, GraphNode])[] = [];
    for (const part of parts) {
        for (const held of part.nodes) {
            const first = nodes.get(held.ref);
            if (first === undefined) {
                nodes.set(held.ref, held);
                continue;
            }
            if (isDuplicate(first, held)) {
                duplicates.push([first, held]);
            }
        }
        for (const edge of part.edges) {
            edges.set(edgeKey(edge), edge);
        }
    }
    return { duplicates, edges: [...edges.values()], nodes: [...nodes.values()] };
};

export const danglingEdges = function danglingEdges(graph: Graph): readonly GraphEdge[] {
    const refs = new Set(graph.nodes.map((held) => held.ref));
    return graph.edges.filter((edge) => !refs.has(edge.from) || !refs.has(edge.to));
};
