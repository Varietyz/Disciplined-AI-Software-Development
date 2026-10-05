import {
    ALGO_DOMAIN_FACE,
    ALGO_FACE,
    ARCH_CATEGORY_FACE,
    ARCH_FACE,
    AXIS_RELATION,
    CATEGORY_RELATION,
    COMPOSED_BY_RELATION,
    COMPOSES_RELATION,
    CONFLICTS_WITH_RELATION,
    CONTRACTS_RELATION,
    CONTRACT_RELATION,
    DERIVED_BY_RELATION,
    DETECTS_RELATION,
    ENABLES_RELATION,
    FACE_SEPARATOR,
    FORCE_FACE,
    GROUNDED_BY_RELATION,
    GROUNDS_RELATION,
    KIND_FACE,
    LAYER_FACE,
    LEX_CATEGORY_FACE,
    LEX_FACE,
    ONTOLOGY_FACES,
    PAG_FACE,
    PRINCIPLE_RELATION,
    REASON_FACE,
    REFERENCED_BY_RELATION,
    REINFORCES_RELATION,
    RELATION_FACE,
    REQUIRES_RELATION,
    STAGE_FACE,
    STAGE_RELATION,
    TENSIONS_RELATION,
    TENSIONS_WITH_RELATION,
    TENSION_FACE,
    TERM_RELATION,
    VOCABULARY_FACE,
} from "@govlab/constants/configuration/constants/ontology.constants.ts";
import { describe, expect, it } from "vitest";

const FACES = [
    ARCH_FACE,
    LEX_FACE,
    ALGO_FACE,
    REASON_FACE,
    STAGE_FACE,
    TENSION_FACE,
    LAYER_FACE,
    FORCE_FACE,
    KIND_FACE,
    RELATION_FACE,
    ARCH_CATEGORY_FACE,
    LEX_CATEGORY_FACE,
    ALGO_DOMAIN_FACE,
    PAG_FACE,
    VOCABULARY_FACE,
];

const RELATIONS = [
    REQUIRES_RELATION,
    REINFORCES_RELATION,
    ENABLES_RELATION,
    CONFLICTS_WITH_RELATION,
    TENSIONS_WITH_RELATION,
    TENSIONS_RELATION,
    CONTRACTS_RELATION,
    TERM_RELATION,
    REFERENCED_BY_RELATION,
    CATEGORY_RELATION,
    PRINCIPLE_RELATION,
    CONTRACT_RELATION,
    STAGE_RELATION,
    AXIS_RELATION,
    COMPOSES_RELATION,
    COMPOSED_BY_RELATION,
    GROUNDS_RELATION,
    GROUNDED_BY_RELATION,
    DERIVED_BY_RELATION,
    DETECTS_RELATION,
];

describe("ONTOLOGY_FACES", () => {
    it("holds every declared face once, so a face prefix resolves to one collection", () => {
        expect([...ONTOLOGY_FACES]).toStrictEqual(FACES);
        expect(new Set(FACES).size).toBe(FACES.length);
    });

    it("keeps the separator out of every face, so a reference splits on its first separator", () => {
        expect(FACES.every((face) => !face.includes(FACE_SEPARATOR))).toBe(true);
    });
});

describe("the relation ids", () => {
    it("are distinct, so a relation id names one edge kind", () => {
        expect(new Set(RELATIONS).size).toBe(RELATIONS.length);
    });
});
