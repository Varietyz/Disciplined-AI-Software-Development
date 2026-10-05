import { COVERED_KINDS, ONTOLOGY_FACET, SITE_LAYER, SOURCE_FACET } from "#configuration/constants/graph.constants";
import type { ChunkRules, Graph, TooltipGap } from "#types/graph.types";
import type { GraphChunk, GraphNode } from "@banes-lab/web/types/graph.types.js";
import type { Population } from "#types/catalog.types";
import type { SectionPlan } from "#types/section.types";
import { isListingRef } from "@banes-lab/web/constants/graph.constants";

const stateOf = function stateOf(node: GraphNode, has: (node: GraphNode) => boolean): string {
    if (isListingRef(node.ref)) {
        return "listing";
    }
    return has(node) ? "present" : "absent";
};

export const presence = function presence(
    name: string,
    nodes: readonly GraphNode[],
    has: (node: GraphNode) => boolean,
): Population {
    const parts = new Map<string, number>();
    for (const held of nodes) {
        const key = `${stateOf(held, has)} ${held.layer} ${held.kind}`;
        parts.set(key, (parts.get(key) ?? 0) + 1);
    }
    return {
        name,
        parts: Object.fromEntries([...parts].toSorted(([a], [b]) => a.localeCompare(b))),
        whole: nodes.length,
    };
};

const facetOf = function facetOf(layer: string): string {
    return layer.startsWith(SOURCE_FACET) ? SOURCE_FACET : layer;
};

export const reaches = function reaches(graph: Graph, facet: string): (node: GraphNode) => boolean {
    const layerOf = new Map(graph.nodes.map((node) => [node.ref, facetOf(node.layer)]));
    const reached = new Set<string>();
    for (const edge of graph.edges.filter((held) => !isListingRef(held.from))) {
        if (layerOf.get(edge.to) === facet) {
            reached.add(edge.from);
        }
        if (layerOf.get(edge.from) === facet) {
            reached.add(edge.to);
        }
    }
    return (node) => reached.has(node.ref);
};

export const coverage = function coverage(graph: Graph): readonly Population[] {
    const facets = [SITE_LAYER, ONTOLOGY_FACET, SOURCE_FACET];
    return facets.flatMap((from) =>
        facets
            .filter((to) => to !== from)
            .map((to) =>
                presence(
                    `${from} to ${to}`,
                    graph.nodes.filter(
                        (node) =>
                            facetOf(node.layer) === from && (from === ONTOLOGY_FACET || COVERED_KINDS.has(node.kind)),
                    ),
                    reaches(graph, to),
                ),
            ),
    );
};

export const layerPopulation = function layerPopulation(nodes: readonly GraphNode[]): Population {
    const parts = new Map<string, number>();
    for (const held of nodes) {
        parts.set(held.layer, (parts.get(held.layer) ?? 0) + 1);
    }
    return { name: "nodes by layer", parts: Object.fromEntries(parts), whole: nodes.length };
};

export const uncoveredSections = function uncoveredSections(
    plans: readonly SectionPlan[],
    teaching: ReadonlySet<string>,
    graph: Graph,
    nodeOf: (page: string, section: string) => string,
): readonly string[] {
    const linksOntology = reaches(graph, ONTOLOGY_FACET);
    const byRef = new Map(graph.nodes.map((held) => [held.ref, held]));
    return plans
        .filter((plan) => teaching.has(nodeOf(plan.page.page, plan.section.id)))
        .map((plan) => plan.identity.ref)
        .filter((ref) => {
            const node = byRef.get(ref);
            return node !== undefined && !linksOntology(node);
        });
};

const carries = function carries(
    chunk: GraphChunk | undefined,
    from: string,
    relation: string,
    to: GraphNode,
): boolean {
    const held = chunk?.[from]?.relations.find((entry) => entry.relation === relation);
    return held?.targets.some((target) => target.href === to.href && target.title === to.title) === true;
};

export const tooltipGaps = function tooltipGaps(
    graph: Graph,
    chunks: ReadonlyMap<string, GraphChunk>,
    rules: ChunkRules,
): readonly TooltipGap[] {
    const nodes = new Map(graph.nodes.map((node) => [node.ref, node]));
    const expected = graph.edges
        .filter((edge) => !rules.skipsSource(edge.from))
        .flatMap((edge) => {
            const reverse = rules.pairs.find((pair) => pair.forward === edge.relation)?.reverse;
            return [
                { from: edge.from, relation: edge.relation, to: edge.to },
                ...(reverse === undefined ? [] : [{ from: edge.to, relation: reverse, to: edge.from }]),
            ];
        })
        .filter((entry) => rules.keptRelations.has(entry.relation));
    return expected.filter((entry) => {
        const target = nodes.get(entry.to);
        return (
            target === undefined || !carries(chunks.get(rules.keyOf(entry.from)), entry.from, entry.relation, target)
        );
    });
};
