import {
    adjacencyOf,
    reachableFrom,
    rootIds,
    selectWithinEdgeBudget,
} from "@govlab/docs/core/analyzers/invocation.analyzer.ts";
import { describe, expect, it } from "vitest";
import type { CodeGraph } from "@govlab/docs/types/graph.types.ts";

const SOURCE = { file: "a.ts", line: 1 };
const GRAPH: CodeGraph = {
    edges: [
        { from: "a", kind: "call", to: "c" },
        { from: "a", kind: "call", to: "b" },
        { from: "b", kind: "call", to: "c" },
    ],
    nodes: [
        { id: "b", kind: "method", label: "b", source: SOURCE },
        { id: "a", kind: "entry", label: "a", source: SOURCE },
        { id: "c", kind: "method", label: "c", source: SOURCE },
    ],
};

describe("adjacencyOf and reachableFrom", () => {
    it("walk depth first from a root in sorted order, visiting each node once", () => {
        const adjacency = adjacencyOf(GRAPH);
        expect(adjacency.get("a")).toStrictEqual(["c", "b"]);
        expect(reachableFrom("a", adjacency)).toStrictEqual(["a", "b", "c"]);
    });
});

describe("selectWithinEdgeBudget", () => {
    it("keeps nodes in order until the next one would exceed the edge budget", () => {
        expect([...selectWithinEdgeBudget(["a", "b", "c"], GRAPH.edges, 1)]).toStrictEqual(["a", "b"]);
        expect([...selectWithinEdgeBudget(["a", "b", "c"], GRAPH.edges, 3)]).toStrictEqual(["a", "b", "c"]);
    });
});

describe("rootIds", () => {
    it("prefers entry nodes and falls back to the first node by id", () => {
        expect(rootIds(GRAPH)).toStrictEqual(["a"]);
        expect(rootIds({ edges: [], nodes: GRAPH.nodes.filter((node) => node.kind === "method") })).toStrictEqual([
            "b",
        ]);
        expect(rootIds({ edges: [], nodes: [] })).toStrictEqual([]);
    });
});
