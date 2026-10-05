import { AnalysisGraph } from "#core/models/graph.model";
import type { Node } from "#types/graph.types";

export const graphOf = function graphOf(nodes: readonly Node[]): AnalysisGraph {
    const graph = new AnalysisGraph(nodes);
    graph.validate();
    return graph;
};
