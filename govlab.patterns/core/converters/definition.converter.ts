import type { CallEdge, CodeGraph, CodeInsight } from "#types/code.types";
import type { DefinitionRecord } from "#types/report.types";
import { keyOf } from "#core/formatters/definition.formatter";

const adjacency = function adjacency(
    edges: readonly CallEdge[],
    endpoints: (edge: CallEdge) => readonly [string, string],
): Map<string, string[]> {
    const map = new Map<string, string[]>();
    for (const edge of edges) {
        const [key, value] = endpoints(edge);
        map.set(key, [...(map.get(key) ?? []), value]);
    }
    return map;
};

const sortedAt = function sortedAt(map: ReadonlyMap<string, string[]>, key: string): string[] {
    return [...(map.get(key) ?? [])].sort((a, b) => a.localeCompare(b));
};

export const definitionRecords = function definitionRecords(
    insight: CodeInsight,
    graph: CodeGraph,
): DefinitionRecord[] {
    const callees = adjacency(graph.edges, (edge) => [edge.from, edge.to]);
    const callers = adjacency(graph.edges, (edge) => [edge.to, edge.from]);
    return insight.symbols.map((stat) => {
        const key = keyOf(stat.file, stat.name);
        return {
            callable: stat.callable,
            callees: sortedAt(callees, key),
            callers: sortedAt(callers, key),
            exported: stat.exported,
            file: stat.file,
            flow: stat.flow,
            inDegree: stat.inDegree,
            kind: stat.kind,
            line: stat.line,
            local: stat.local,
            name: stat.name,
            outDegree: stat.outDegree,
        };
    });
};
