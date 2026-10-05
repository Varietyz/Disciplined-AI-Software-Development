import { LINKS_TO, graphNode } from "./graph.fixture.ts";
import { chunkKeyOf, isListingRef } from "@banes-lab/web/configuration/constants/graph.constants.ts";
import { describe, expect, it } from "vitest";
import type { ChunkRules } from "@banes-lab/build-scripts/types/graph.types.ts";
import { chunksOf } from "@banes-lab/build-scripts/core/converters/graph.segment.converter.ts";

const SECTION = "chapter:/p#s";
const RECORD = "architecture:x";
const PART = "part:/p#s/1";
const CONTAINS = "contains";
const LINKED_FROM = "linked-from";
const SECTION_CHUNK = "chapter-p";
const SECTION_HREF = "/p#s";
const RECORD_HREF = "/ontology#architecture-x";

const GRAPH = {
    edges: [
        { from: SECTION, relation: LINKS_TO, to: RECORD },
        { from: SECTION, relation: CONTAINS, to: PART },
    ],
    nodes: [graphNode(SECTION, SECTION_HREF), graphNode(RECORD, RECORD_HREF), graphNode(PART, null)],
};

const RULES: ChunkRules = {
    contains: CONTAINS,
    keptRelations: new Set([LINKS_TO, LINKED_FROM]),
    keyOf: chunkKeyOf,
    pairs: [
        { forward: LINKS_TO, reverse: LINKED_FROM },
        { forward: CONTAINS, reverse: "contained-in" },
    ],
    rollsUp: new Set<string>(),
    skipsSource: isListingRef,
};

describe("chunksOf", () => {
    it("keeps only the declared relations, adds each reverse, and emits only nodes that carry one", () => {
        const chunks = chunksOf(GRAPH, RULES);
        expect([...chunks.keys()].sort()).toStrictEqual(["architecture", SECTION_CHUNK]);
        expect(chunks.get("architecture")?.[RECORD]?.relations).toStrictEqual([
            { relation: LINKED_FROM, targets: [{ href: SECTION_HREF, number: null, title: SECTION }] },
        ]);
        expect(chunks.get(SECTION_CHUNK)?.[SECTION]?.relations.map((held) => held.relation)).toStrictEqual([LINKS_TO]);
    });

    it("drops the links a listing page's sections carry, so a record is not linked from its own listing", () => {
        const listing = {
            edges: [{ from: "chapter:/ontology#principles", relation: LINKS_TO, to: RECORD }],
            nodes: [graphNode("chapter:/ontology#principles", "/ontology#principles"), graphNode(RECORD, null)],
        };
        expect(chunksOf(listing, RULES).size).toBe(0);
    });

    it("rolls a declared reverse relation up from a part to the section that contains it", () => {
        const graph = {
            edges: [
                { from: SECTION, relation: CONTAINS, to: PART },
                { from: RECORD, relation: LINKS_TO, to: PART },
            ],
            nodes: [graphNode(SECTION, SECTION_HREF), graphNode(RECORD, RECORD_HREF), graphNode(PART, null)],
        };
        const reverseOn = function reverseOn(rules: ChunkRules): readonly string[] {
            const section = chunksOf(graph, rules).get(SECTION_CHUNK)?.[SECTION];
            return section?.relations.map((held) => held.relation) ?? [];
        };
        expect(reverseOn({ ...RULES, rollsUp: new Set([LINKED_FROM]) })).toStrictEqual([LINKED_FROM]);
        expect(reverseOn(RULES)).toStrictEqual([]);
    });
});
