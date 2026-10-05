import { GraphError, validateGraph } from "@govlab/patterns/core/validators/graph.validator.ts";
import { analysisNode, findingNode, sourceNode } from "@govlab/patterns/core/factories/node.factory.ts";
import { describe, expect, it } from "vitest";
import type { Node } from "@govlab/patterns/types/graph.types.ts";
import { coordinate } from "@govlab/patterns/core/factories/axis.factory.ts";
import { stepsBack } from "@govlab/patterns/configuration/strings/graph.strings.ts";

const at = function at(reasoning: string): ReturnType<typeof coordinate> {
    return coordinate({ analysis: "frequency", ontology: "probability", reasoning, representation: "symbolic" });
};

const validNodes = function validNodes(): Node[] {
    const analysis = analysisNode("color", "frequency");
    return [sourceNode(), analysis, findingNode(analysis.id, "frequency", at("explanation"))];
};

describe("validateGraph", () => {
    it("accepts a well-formed records to analysis to finding graph", () => {
        expect(() => {
            validateGraph(validNodes());
        }).not.toThrow();
    });

    it("refuses a node produced twice", () => {
        const nodes = validNodes();
        expect(() => {
            validateGraph([...nodes, ...nodes.slice(1, 2)]);
        }).toThrow(GraphError);
    });

    it("refuses a node that consumes a missing producer", () => {
        expect(() => {
            validateGraph([sourceNode(), findingNode("color:missing", "x", at("explanation"))]);
        }).toThrow(GraphError);
    });

    it("refuses an edge that steps back on the reasoning axis", () => {
        const analysis = analysisNode("color", "frequency");
        const back = findingNode(analysis.id, "back", at("observation"));
        expect(() => {
            validateGraph([sourceNode(), analysis, back]);
        }).toThrow(stepsBack(analysis.id, back.id));
    });

    it("refuses an analysis node that no finding consumes", () => {
        expect(() => {
            validateGraph([sourceNode(), analysisNode("color", "frequency")]);
        }).toThrow(GraphError);
    });
});
