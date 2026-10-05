import { analysisNode, findingNode, sourceNode } from "@govlab/patterns/core/factories/node.factory.ts";
import { describe, expect, it } from "vitest";
import { SOURCE_ID } from "@govlab/patterns/configuration/constants/graph.constants.ts";
import { coordinate } from "@govlab/patterns/core/factories/axis.factory.ts";

const COORD = coordinate({
    analysis: "frequency",
    ontology: "probability",
    reasoning: "explanation",
    representation: "symbolic",
});

describe("the graph node factories", () => {
    it("builds the source node at the observation rung with no inputs", () => {
        expect(sourceNode()).toStrictEqual({
            id: SOURCE_ID,
            inputs: [],
            kind: "source",
            reasoning: "observation",
            tags: [],
        });
    });

    it("builds an analysis node fed by the source and tagged with its matcher", () => {
        const node = analysisNode("color", "distribution");
        expect(node.id).toBe("color:distribution");
        expect(node.inputs).toStrictEqual([SOURCE_ID]);
        expect(node.tags).toStrictEqual(["distribution"]);
    });

    it("builds a finding node at the coordinate's rung, tagged with its three other axes", () => {
        const node = findingNode("color:distribution", "frequency", COORD);
        expect(node.reasoning).toBe("explanation");
        expect(node.tags).toStrictEqual(["probability", "frequency", "symbolic"]);
    });
});
