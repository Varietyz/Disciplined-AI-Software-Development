import {
    EDGE_KINDS,
    NODE_KINDS,
    RECOGNIZER_EDGE_KINDS,
    RECOGNIZER_NODE_KINDS,
} from "@govlab/docs/configuration/constants/graph.constants.ts";
import { describe, expect, it } from "vitest";
import { loadRecognizers } from "@govlab/docs/core/loaders/syntax.loader.ts";

const recognizers = await loadRecognizers();
const emittedNodes = new Set(recognizers.flatMap((recognizer) => recognizer.emits.nodes));
const emittedEdges = new Set(recognizers.flatMap((recognizer) => recognizer.emits.edges));

describe("loadRecognizers", () => {
    it("covers every recognizer-owned kind", () => {
        expect(RECOGNIZER_NODE_KINDS.filter((kind) => !emittedNodes.has(kind))).toStrictEqual([]);
        expect(RECOGNIZER_EDGE_KINDS.filter((kind) => !emittedEdges.has(kind))).toStrictEqual([]);
    });

    it("emits no kind outside the graph vocabulary", () => {
        expect([...emittedNodes].filter((kind) => !NODE_KINDS.includes(kind))).toStrictEqual([]);
        expect([...emittedEdges].filter((kind) => !EDGE_KINDS.includes(kind))).toStrictEqual([]);
    });
});
