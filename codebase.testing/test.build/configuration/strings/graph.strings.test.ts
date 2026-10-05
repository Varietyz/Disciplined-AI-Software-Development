import {
    NO_GRAPH_REPORT,
    POPULATION_NOUNS,
    ambiguousRelation,
    danglingEdge,
    duplicateNode,
    emptyPopulation,
    graphLines,
    graphReportEmpty,
    graphReportMissing,
    malformedReportEntries,
    missingPopulation,
    missingReportList,
    sharedNumber,
    tooltipGap,
    unbalancedPopulation,
    uncoveredSection,
    undeclaredAbsence,
    undeclaredRelation,
    unresolvedTarget,
} from "@banes-lab/build-scripts/configuration/strings/graph.strings.ts";
import { describe, expect, it } from "vitest";
import { graphNode } from "../../core/converters/graph.fixture.ts";

const EDGE = { from: "a", relation: "requires", to: "b" };
const FILES = { graph: "g.ts", learning: "l.ts", report: "r.json", search: "s.ts", tabs: "t.ts" };
const REPORT = {
    ambiguous: [],
    dangling: [EDGE],
    duplicates: [],
    fields: [],
    graph: { edges: [EDGE], nodes: [graphNode("a", null), graphNode("b", null)] },
    populations: [],
    tooltipGaps: [],
    uncovered: [],
    undeclared: [],
    unresolved: [],
};
const SEARCH = { definitions: [], positions: { evidence: {}, links: { a: 1 }, route: { a: 1, b: 2 } } };

describe("graphLines", () => {
    it("writes one line per derived artifact, closing with a newline", () => {
        const text = graphLines({ chunks: 4, records: 9, report: REPORT, routes: 3, search: SEARCH, stops: 2 }, FILES);
        expect(text).toContain("learning: wrote 2 stop(s) into l.ts");
        expect(text).toContain("graph: derived 2 node(s) and 1 edge(s) from 9 record(s) into r.json");
        expect(text).toContain("1 dangling edge(s)");
        expect(text).toContain("search: wrote 2 route position(s), 1 link position(s)");
        expect(text.endsWith("\n")).toBe(true);
    });
});

describe("the relation graph findings", () => {
    it("name the record, the relation and the repair each finding asks for", () => {
        expect(NO_GRAPH_REPORT.length).toBeGreaterThan(0);
        expect(graphReportMissing("r.json")).toContain("missing at r.json");
        expect(graphReportEmpty("r.json")).toContain("r.json carries no graph");
        expect(missingPopulation("records")).toContain("carries no records population");
        expect(missingReportList("graph.nodes")).toContain("holds no graph.nodes list");
        expect(malformedReportEntries("dangling", 2)).toContain("2 entry(s) in the dangling list");
        expect(POPULATION_NOUNS.get("node links")).toBe("link");
        expect(sharedNumber("3", "a", "b")).toBe("The number 3 is carried by both a and b.");
        expect(undeclaredAbsence(2, "file", "site", "link")).toContain("2 file node(s) in the site layer have no link");
        expect(emptyPopulation("records")).toBe("The relation graph report read no records.");
        expect(unbalancedPopulation("records", 3, 4)).toContain("add up to 3, and 4 were read");
        expect(undeclaredRelation("lexicon", "invented")).toContain('"invented"');
        expect(ambiguousRelation("lexicon", "invented")).toContain("GRAPH_FIELD_RULES");
        expect(unresolvedTarget("architecture:a", "gone", "requires")).toContain('names "gone" in its requires field');
        expect(duplicateNode(graphNode("a", null), { ...graphNode("a", null), layer: "ontology" })).toContain(
            "in the ontology layer",
        );
        expect(uncoveredSection("chapter:/p#s")).toContain("chapter:/p#s links no ontology record");
        expect(tooltipGap(EDGE)).toContain("the requires edge to b");
        expect(danglingEdge(EDGE)).toContain('The edge "requires" from a to b');
    });
});
