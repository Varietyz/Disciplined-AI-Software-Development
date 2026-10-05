import { num, pct } from "#core/formatters/metric.formatter";
import type { AnalysisStats } from "#types/code.types";
import type { DependencyGraph } from "#types/dependency.types";

const flowRows = function flowRows(analysis: AnalysisStats): string[] {
    return [...analysis.byFlow.entries()]
        .toSorted((a, b) => b[1] - a[1])
        .map(([flow, count]) => `| \`${flow}\` | ${num(count)} | ${pct(count, analysis.definitions)} |`);
};

const callGraphLines = function callGraphLines(analysis: AnalysisStats): string[] {
    if (analysis.modulesAnalyzed === 0) {
        return [];
    }
    return [
        "### Symbol call-graph",
        "",
        "| Definition flow | Count | Share |",
        "| --- | ---: | ---: |",
        ...flowRows(analysis),
        "",
        "| Metric | Value |",
        "| --- | ---: |",
        `| producer | \`${analysis.producer}\` |`,
        `| modules analyzed | ${num(analysis.modulesAnalyzed)} |`,
        `| definitions | ${num(analysis.definitions)} |`,
        `| call edges | ${num(analysis.edges)} |`,
        `| edges resolved | ${pct(analysis.edges - analysis.unresolvedCalls, analysis.edges)} |`,
        `| unresolved external calls | ${num(analysis.unresolvedCalls)} |`,
        "",
    ];
};

export const interactionSection = function interactionSection(
    graph: DependencyGraph,
    analysis: AnalysisStats,
): string[] {
    return [
        "## IV. Interaction",
        "",
        "### Internal package graph",
        "",
        "| Package | Fan-in | Fan-out | Location |",
        "| --- | ---: | ---: | --- |",
        ...graph.links.map(
            (node) => `| \`${node.name}\` | ${num(node.fanIn)} | ${num(node.fanOut)} | \`${node.rel}\` |`,
        ),
        "",
        "| Metric | Value |",
        "| --- | ---: |",
        `| packages | ${num(graph.nodeCount)} |`,
        `| internal edges | ${num(graph.edges)} |`,
        `| packages with no internal edge | ${num(graph.isolated)} |`,
        "",
        ...callGraphLines(analysis),
    ];
};
