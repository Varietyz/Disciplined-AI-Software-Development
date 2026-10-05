import { describe, expect, it } from "vitest";
import { AnalysisGraph } from "@govlab/patterns/core/models/graph.model.ts";
import { GraphError } from "@govlab/patterns/core/validators/graph.validator.ts";
import { sourceNode } from "@govlab/patterns/core/factories/node.factory.ts";

describe("AnalysisGraph", () => {
    it("holds its nodes and validates them on demand", () => {
        const graph = new AnalysisGraph([sourceNode()]);
        graph.validate();
        expect(graph.nodes).toHaveLength(1);
    });

    it("surfaces a validation failure as a GraphError", () => {
        const graph = new AnalysisGraph([sourceNode(), sourceNode()]);
        expect(() => {
            graph.validate();
        }).toThrow(GraphError);
    });
});
