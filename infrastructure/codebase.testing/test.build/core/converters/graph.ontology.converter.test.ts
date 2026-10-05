import { REFERENCED_BY, VOCABULARY } from "./graph.fixture.ts";
import { describe, expect, it } from "vitest";
import type { FieldRule } from "@banes-lab/build-scripts/types/graph.types.ts";
import { GRAPH_FIELD_RULES } from "@banes-lab/build-scripts/configuration/constants/graph.constants.ts";
import type { ReferenceFaces } from "@banes-lab/build-scripts/types/ontology.types.ts";
import type { ReferenceRecord } from "@banes-lab/web/types/reference.types.ts";
import { mergeGraphs } from "@banes-lab/build-scripts/core/converters/graph.converter.ts";
import { ontologyGraph } from "@banes-lab/build-scripts/core/converters/graph.ontology.converter.ts";

const PRINCIPLE_A = "architecture:a";

const record = function record(kind: string, relations: readonly { relation: string; to: string }[]): ReferenceRecord {
    return {
        code: null,
        kind,
        layer: null,
        name: kind,
        relations: relations.map((held) => ({ edges: [{ label: held.to, ref: held.to }], relation: held.relation })),
        summary: null,
    };
};

const FACES: ReferenceFaces = new Map([
    [
        "architecture",
        {
            [PRINCIPLE_A]: record("principle", [
                { relation: "term", to: "lexicon:t" },
                { relation: "requires", to: "architecture:b" },
            ]),
            "architecture:b": record("principle", [{ relation: REFERENCED_BY, to: PRINCIPLE_A }]),
        },
    ],
    [
        "lexicon",
        {
            "lexicon:t": record("term", [
                { relation: "term-of", to: PRINCIPLE_A },
                { relation: "invented", to: PRINCIPLE_A },
            ]),
        },
    ],
]);

describe("ontologyGraph", () => {
    it("stores each edge once in its forward direction, skips a reverse shared by several forwards, and lists an undeclared relation", () => {
        const graph = ontologyGraph(FACES, VOCABULARY, new Map<string, FieldRule>());
        expect(mergeGraphs([graph]).edges).toStrictEqual([
            { from: PRINCIPLE_A, relation: "term", to: "lexicon:t" },
            { from: PRINCIPLE_A, relation: "requires", to: "architecture:b" },
        ]);
        expect(graph.undeclared).toStrictEqual([{ face: "lexicon", kind: "term", relation: "invented" }]);
        expect(graph.fields).toContainEqual({
            face: "lexicon",
            flip: true,
            kind: "term",
            relation: "term-of",
            stored: "term",
        });
    });

    it("applies an override for a relation whose meaning depends on the collection", () => {
        const overrides = new Map<string, FieldRule>([["lexicon:invented", { flip: true, relation: "term" }]]);
        expect(ontologyGraph(FACES, VOCABULARY, overrides).undeclared).toStrictEqual([]);
    });

    it("stores no edge for a field the rules mark as inverse only", () => {
        expect(GRAPH_FIELD_RULES.get("architecture:referenced-by")).toStrictEqual({ flip: false, relation: null });
        const graph = ontologyGraph(FACES, VOCABULARY, GRAPH_FIELD_RULES);
        expect(graph.fields).toContainEqual({
            face: "architecture",
            flip: false,
            kind: "principle",
            relation: REFERENCED_BY,
            stored: null,
        });
    });

    it("prefers an override for the record kind over one for the whole collection", () => {
        const overrides = new Map<string, FieldRule>([
            ["lexicon:invented", { flip: false, relation: null }],
            ["lexicon:term:invented", { flip: true, relation: "term" }],
        ]);
        const graph = ontologyGraph(FACES, VOCABULARY, overrides);
        expect(graph.fields).toContainEqual({
            face: "lexicon",
            flip: true,
            kind: "term",
            relation: "invented",
            stored: "term",
        });
    });
});
