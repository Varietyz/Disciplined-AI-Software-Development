import type { CodeEdgeKind, CodeNodeKind } from "@govlab/docs/types/graph.types.ts";
import {
    classForKind,
    dedupEdges,
    shapeForKind,
    weightForKind,
} from "@govlab/docs/core/converters/diagram.converter.ts";
import { describe, expect, it } from "vitest";

const NODE_KINDS: CodeNodeKind[] = ["entry", "collaborator", "gate", "store", "method"];
const EDGE_KINDS: CodeEdgeKind[] = ["hook-register", "teardown", "data-flow", "branch", "call"];

describe("the kind mappings", () => {
    it("map node kinds to shapes and classes, and edge kinds to weights", () => {
        expect(NODE_KINDS.map(shapeForKind)).toStrictEqual(["endpoint", "collaborator", "decision", "store", "rect"]);
        expect(EDGE_KINDS.map(weightForKind)).toStrictEqual(["hook", "teardown", "dependency", "branch", "call"]);
        expect([classForKind("entry"), classForKind("method")]).toStrictEqual(["kEntry", "kMethod"]);
    });
});

describe("dedupEdges", () => {
    it("keeps the first edge per endpoint pair, weight and label", () => {
        const edges = [
            { from: "a", to: "b" },
            { from: "a", to: "b" },
            { from: "a", label: "x", to: "b" },
        ];
        expect(dedupEdges(edges)).toStrictEqual([edges[0], edges[2]]);
    });
});
