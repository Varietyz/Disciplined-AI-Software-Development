import { LINKS_TO, PLANS, graphNode } from "../converters/graph.fixture.ts";
import {
    coverage,
    layerPopulation,
    presence,
    reaches,
    tooltipGaps,
    uncoveredSections,
} from "@banes-lab/build-scripts/core/analyzers/graph.analyzer.ts";
import { describe, expect, it } from "vitest";

const SECTION = "chapter:/p#taught";
const RECORD = "architecture:x";

const section = { ...graphNode(SECTION, "/p#taught"), kind: "section" };
const record = { ...graphNode(RECORD, "/ontology#x"), layer: "ontology" as const };
const GRAPH = { edges: [{ from: SECTION, relation: LINKS_TO, to: RECORD }], nodes: [section, record] };

const nodeOf = function nodeOf(page: string, id: string): string {
    return `${page}/${id.slice(id.indexOf("#") + 1)}`;
};

describe("presence and layerPopulation", () => {
    it("counts nodes by state, layer and kind, and by layer alone", () => {
        const population = presence("site links", GRAPH.nodes, (node) => node.ref === SECTION);
        expect(population).toStrictEqual({
            name: "site links",
            parts: { "absent ontology k": 1, "present site section": 1 },
            whole: 2,
        });
        expect(layerPopulation(GRAPH.nodes).parts).toStrictEqual({ ontology: 1, site: 1 });
    });
});

describe("reaches and coverage", () => {
    it("tells which nodes an edge joins to a facet and counts each facet's reach of the others", () => {
        expect(reaches(GRAPH, "ontology")(section)).toBe(true);
        expect(reaches(GRAPH, "site")(record)).toBe(true);
        const siteToOntology = coverage(GRAPH).find((held) => held.name === "site to ontology");
        expect(siteToOntology?.parts).toStrictEqual({ "present site section": 1 });
    });
});

describe("uncoveredSections", () => {
    it("names a teaching section that links no ontology record", () => {
        const teaching = new Set(["p/taught"]);
        const unlinked = { edges: [], nodes: [section] };
        expect(uncoveredSections(PLANS, teaching, unlinked, nodeOf)).toStrictEqual([SECTION]);
        expect(uncoveredSections(PLANS, teaching, GRAPH, nodeOf)).toStrictEqual([]);
    });
});

describe("tooltipGaps", () => {
    it("names each kept edge, and its reverse, that the chunk for its source does not carry", () => {
        const rules = {
            contains: "contains",
            keptRelations: new Set([LINKS_TO, "linked-from"]),
            keyOf: (ref: string) => ref.slice(0, ref.indexOf(":")),
            pairs: [{ forward: LINKS_TO, reverse: "linked-from" }],
            rollsUp: new Set<string>(),
            skipsSource: () => false,
        };
        const gaps = tooltipGaps(GRAPH, new Map(), rules);
        expect(gaps.map((gap) => gap.relation)).toStrictEqual([LINKS_TO, "linked-from"]);
        const chunk = {
            [SECTION]: {
                kind: "section",
                number: null,
                relations: [{ relation: LINKS_TO, targets: [{ href: "/ontology#x", number: null, title: RECORD }] }],
                title: SECTION,
            },
        };
        expect(tooltipGaps(GRAPH, new Map([["chapter", chunk]]), rules).map((gap) => gap.relation)).toStrictEqual([
            "linked-from",
        ]);
    });
});
