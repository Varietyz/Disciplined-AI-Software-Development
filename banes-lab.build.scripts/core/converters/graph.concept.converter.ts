import type { Concept } from "@govlab/context";
import type { GraphEdge } from "@banes-lab/web/types/graph.types.js";
import type { Resolver } from "#types/ontology.types";

export const conceptEdges = function conceptEdges(
    concepts: readonly Concept[],
    resolve: Resolver,
    relation: string,
): readonly GraphEdge[] {
    return concepts.flatMap((concept) => {
        const home = resolve.target(concept.home).ref;
        if (home === null) {
            return [];
        }
        return concept.members.flatMap((member) => {
            const from = resolve.target(member).ref;
            return from === null ? [] : [{ from, relation, to: home }];
        });
    });
};
