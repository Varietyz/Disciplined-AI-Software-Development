import type { CallEdge, CodeGraph } from "#types/code.types";

export const sortedEdges = function sortedEdges(graph: CodeGraph): CallEdge[] {
    return [...graph.edges].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
};

export const unresolvedNames = function unresolvedNames(graph: CodeGraph): string[] {
    return [...new Set(graph.external.map((call) => call.name))].sort((a, b) => a.localeCompare(b));
};
