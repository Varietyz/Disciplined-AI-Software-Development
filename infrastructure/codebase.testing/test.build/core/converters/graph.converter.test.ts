import { CONTAINS_RELATION, EVIDENCE_RELATION_ID } from "@banes-lab/web/constants/graph.constants";
import { REFERENCED_BY, VOCABULARY, graphNode } from "./graph.fixture.ts";
import {
    danglingEdges,
    edgeIndexOf,
    groundingSources,
    inboundRelations,
    mergeGraphs,
    outboundRelations,
} from "@banes-lab/build-scripts/core/converters/graph.converter.ts";
import { describe, expect, it } from "vitest";

const A = "architecture:a";
const B = "architecture:b";
const GRAPH = { edges: [{ from: A, relation: "requires", to: B }], nodes: [graphNode(A, null), graphNode(B, null)] };

describe("inboundRelations", () => {
    it("groups each node's inbound edges under the declared reverse, titled by the source", () => {
        expect(inboundRelations(GRAPH, VOCABULARY.pairs).get(B)).toStrictEqual([
            { edges: [{ label: A, ref: A }], relation: REFERENCED_BY },
        ]);
        expect(() =>
            inboundRelations({ edges: [{ from: "a", relation: "invented", to: "b" }], nodes: [] }, VOCABULARY.pairs),
        ).toThrow('the relation "invented" from a has no reverse');
    });
});

describe("outboundRelations", () => {
    it("groups each node's outgoing edges under their own relation, titled by the target, once per target", () => {
        const twice = { edges: [...GRAPH.edges, ...GRAPH.edges], nodes: GRAPH.nodes };
        expect(outboundRelations(twice).get(A)).toStrictEqual([
            { edges: [{ label: B, ref: B }], relation: "requires" },
        ]);
        expect(outboundRelations(GRAPH).get(B)).toBeUndefined();
    });
});

describe("edgeIndexOf", () => {
    it("answers each node's outgoing and incoming edges by relation", () => {
        const index = edgeIndexOf(GRAPH);
        expect(index.outgoing(A, "requires")).toStrictEqual([{ label: B, ref: B }]);
        expect(index.incoming(B, "requires")).toStrictEqual([{ label: A, ref: A }]);
        expect(index.incoming(A, "requires")).toStrictEqual([]);
    });
});

describe("groundingSources", () => {
    const SECTION = "chapter:/anatomy#f";
    const FOLDER = "anatomy:f";
    const FILE = "anatomy:f/x.ts";
    const TEACHER = "chapter:/p#s";
    const OTHER = "chapter:/p#t";
    const graph = {
        edges: [
            { from: TEACHER, relation: EVIDENCE_RELATION_ID, to: FOLDER },
            { from: FOLDER, relation: CONTAINS_RELATION, to: FILE },
            { from: OTHER, relation: EVIDENCE_RELATION_ID, to: FILE },
        ],
        nodes: [
            graphNode(SECTION, "/anatomy#f"),
            graphNode(FOLDER, "/anatomy#f"),
            graphNode(FILE, null),
            graphNode(TEACHER, null),
            graphNode(OTHER, null),
        ],
    };

    it("reads evidence into every node that shares the ref's page address, so a folder cited as evidence grounds its section", () => {
        const sources = groundingSources(graph, edgeIndexOf(graph), (ref) => (ref === SECTION ? "/anatomy#f" : null));
        expect(sources(SECTION)).toStrictEqual([{ label: TEACHER, ref: TEACHER }]);
    });

    it("reads evidence into the parts a node contains, and lists each source once", () => {
        const sources = groundingSources(graph, edgeIndexOf(graph), () => null);
        expect(sources(FOLDER)).toStrictEqual([
            { label: TEACHER, ref: TEACHER },
            { label: OTHER, ref: OTHER },
        ]);
        expect(sources(TEACHER)).toStrictEqual([]);
    });
});

describe("mergeGraphs", () => {
    it("keeps the first node per ref, stores each edge once and reports a ref claimed by two kinds", () => {
        const clash = { ...graphNode(B, null), kind: "other" };
        const merged = mergeGraphs([GRAPH, { edges: GRAPH.edges, nodes: [clash] }]);
        expect(merged.nodes).toHaveLength(2);
        expect(merged.edges).toHaveLength(1);
        expect(merged.duplicates).toHaveLength(1);
    });
});

describe("danglingEdges", () => {
    it("names an edge whose end no node carries", () => {
        expect(danglingEdges(GRAPH)).toStrictEqual([]);
        expect(
            danglingEdges({ edges: [{ from: A, relation: "requires", to: "gone" }], nodes: GRAPH.nodes }),
        ).toHaveLength(1);
    });
});
