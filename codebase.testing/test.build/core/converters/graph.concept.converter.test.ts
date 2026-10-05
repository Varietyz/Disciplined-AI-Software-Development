import { CONCEPTS, createGovlabContext } from "@govlab/context";
import { describe, expect, it } from "vitest";
import { conceptEdges } from "@banes-lab/build-scripts/core/converters/graph.concept.converter.ts";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";

const RELATION = "concept";
const resolve = createResolver(createGovlabContext());

describe("conceptEdges", () => {
    it("joins every member of every bundled concept to its home", () => {
        const edges = conceptEdges(CONCEPTS, resolve, RELATION);
        const members = CONCEPTS.reduce((count, concept) => count + concept.members.length, 0);
        expect(edges).toHaveLength(members);
        for (const concept of CONCEPTS) {
            const home = resolve.target(concept.home).ref;
            const joined = edges.filter((edge) => edge.to === home).map((edge) => edge.from);
            expect(joined).toEqual(concept.members.map((member) => resolve.target(member).ref));
        }
        expect(edges.every((edge) => edge.relation === RELATION)).toBe(true);
    });

    it("drops a member that resolves to nothing, and a concept whose home resolves to nothing", () => {
        const planted = [
            {
                home: "reasoning:dimension:cause",
                id: "cause",
                members: ["reasoning:lens:cause", "reasoning:lens:ghost"],
            },
            { home: "reasoning:dimension:ghost", id: "ghost", members: ["reasoning:lens:cause"] },
        ];
        expect(conceptEdges(planted, resolve, RELATION)).toEqual([
            {
                from: resolve.target("reasoning:lens:cause").ref,
                relation: RELATION,
                to: resolve.target("reasoning:dimension:cause").ref,
            },
        ]);
    });
});
