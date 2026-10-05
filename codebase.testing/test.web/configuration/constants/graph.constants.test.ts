import {
    BUILDS_ON_RELATION,
    CALLS_RELATION_ID,
    CONCEPT_RELATION,
    CONCERN_LAYER_RELATION,
    CONCERN_RELATION,
    CONTAINED_IN_RELATION,
    CONTAINS_RELATION,
    DETECTED_BY_RELATION,
    ENFORCED_BY_RELATION,
    EVIDENCE_FOR_RELATION,
    GOVERNED_BY_RELATION,
    LEAF_RELATIONS,
    LINKS_TO_RELATION,
    REFERENCES_RELATION,
    RELATIONS,
    RELATION_PAIRS,
    ROLLED_UP_RELATIONS,
    TOOLTIP_RELATIONS,
    USES_RELATION,
    isListingRef,
    relationId,
    reverseOf,
} from "@banes-lab/web/configuration/constants/graph.constants.ts";
import { describe, expect, it } from "vitest";

const KEBAB = "abcdefghijklmnopqrstuvwxyz-";
const CONFLICTS_WITH = "conflicts-with";

const isKebab = function isKebab(name: string): boolean {
    for (const character of name) {
        if (!KEBAB.includes(character)) {
            return false;
        }
    }
    return true;
};

describe("the relation vocabulary", () => {
    it("declares each forward relation once, so every forward has exactly one reverse", () => {
        const forwards = RELATION_PAIRS.map((pair) => pair.forward);
        expect(new Set(forwards).size).toBe(forwards.length);
    });

    it("spells every relation in kebab case", () => {
        const names = RELATION_PAIRS.flatMap((pair) => [pair.forward, pair.reverse]);
        expect(names.filter((name) => !isKebab(name))).toStrictEqual([]);
    });

    it("reads the snake and camel spellings govlab uses as the declared kebab id", () => {
        expect(relationId("conflicts_with")).toBe(CONFLICTS_WITH);
        expect(relationId("conflictsWith")).toBe(CONFLICTS_WITH);
        expect(relationId(CONFLICTS_WITH)).toBe(CONFLICTS_WITH);
        expect(reverseOf(relationId("tensionsWith"))).toBe("tensions-with");
    });

    it("gives no reverse to a relation the vocabulary does not declare", () => {
        expect(reverseOf("undeclared")).toBeNull();
    });

    it("pairs the site relations the graph builder emits with their own reverses", () => {
        expect(reverseOf(LINKS_TO_RELATION)).toBe("linked-from");
        expect(reverseOf(CALLS_RELATION_ID)).toBe("called-by");
        expect(reverseOf(CONTAINS_RELATION)).toBe(CONTAINED_IN_RELATION);
        expect(reverseOf(BUILDS_ON_RELATION)).toBe("prerequisite-of");
    });

    it("gives each principle relation a reverse of its own rather than one shared name", () => {
        expect(reverseOf("requires")).toBe("required-by");
        expect(reverseOf("reinforces")).toBe("reinforced-by");
        expect(reverseOf("enables")).toBe("enabled-by");
        expect(reverseOf(CONFLICTS_WITH)).toBe("negated-by");
    });

    it("derives the pairs, the tooltip set, the roll-ups and the leaf relations from one relation record", () => {
        expect(RELATION_PAIRS).toHaveLength(RELATIONS.length);
        expect(TOOLTIP_RELATIONS.has(LINKS_TO_RELATION) && TOOLTIP_RELATIONS.has(EVIDENCE_FOR_RELATION)).toBe(true);
        expect([...ROLLED_UP_RELATIONS]).toStrictEqual([
            EVIDENCE_FOR_RELATION,
            "referenced-from",
            "governs",
            "concern-of",
            "concern-layer-of",
        ]);
        expect(LEAF_RELATIONS.map((relation) => relation.forward)).toContain(USES_RELATION);
    });

    it("pairs the relations the graph producers emit with their reverses", () => {
        expect(reverseOf(REFERENCES_RELATION)).toBe("referenced-from");
        expect(reverseOf(ENFORCED_BY_RELATION)).toBe("enforces");
        expect(reverseOf(DETECTED_BY_RELATION)).toBe("detects");
        expect(reverseOf(GOVERNED_BY_RELATION)).toBe("governs");
        expect(reverseOf(CONCEPT_RELATION)).toBe("concept-of");
        expect(reverseOf(CONCERN_RELATION)).toBe("concern-of");
        expect(reverseOf(CONCERN_LAYER_RELATION)).toBe("concern-layer-of");
    });

    it("treats only the listing page's sections as listing sources", () => {
        expect(isListingRef("chapter:/ontology#principles")).toBe(true);
        expect(isListingRef("chapter:/pag#setup")).toBe(false);
        expect(isListingRef("architecture:x")).toBe(false);
    });
});
