import { ANALYSIS_RUNG, SOURCE_ID, SOURCE_RUNG } from "#configuration/constants/graph.constants";
import type { Coordinate } from "#types/axis.types";
import type { Node } from "#types/graph.types";

export const sourceNode = function sourceNode(): Node {
    return { id: SOURCE_ID, inputs: [], kind: "source", reasoning: SOURCE_RUNG, tags: [] };
};

export const analysisNode = function analysisNode(field: string, matcher: string): Node {
    return {
        id: `${field}:${matcher}`,
        inputs: [SOURCE_ID],
        kind: "analysis",
        reasoning: ANALYSIS_RUNG,
        tags: [matcher],
    };
};

export const findingNode = function findingNode(producer: string, name: string, coord: Coordinate): Node {
    return {
        id: `${producer}:${name}`,
        inputs: [producer],
        kind: "finding",
        reasoning: coord.reasoning,
        tags: [coord.ontology, coord.analysis, coord.representation],
    };
};
