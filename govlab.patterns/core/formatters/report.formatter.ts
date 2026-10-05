import type { AnalysisModel, ModuleFindings } from "#types/report.types";
import { sortedEdges, unresolvedNames } from "#core/selectors/code.selector";
import type { CodeFinding } from "#types/code.types";
import { definitionRecords } from "#core/converters/definition.converter";
import { resolutionRate } from "#core/counters/report.counter";
import { tally } from "#core/counters/base.counter";

const ROW_JOIN = ",\n";

const section = function section(key: string, items: readonly unknown[]): string {
    const rows = items.map((item) => JSON.stringify(item)).join(ROW_JOIN);
    return items.length === 0 ? `"${key}": []` : `"${key}": [\n${rows}\n]`;
};

const byKind = function byKind(findings: readonly CodeFinding[]): Record<string, number> {
    return tally(findings, (finding) => finding.kind);
};

const byModuleName = function byModuleName(left: { module: string }, right: { module: string }): number {
    return left.module.localeCompare(right.module);
};

export const buildFindings = function buildFindings(title: string, findings: readonly CodeFinding[]): string {
    const summary = { byKind: byKind(findings), total: findings.length };
    return `{\n"module": ${JSON.stringify(title)},\n"summary": ${JSON.stringify(summary)},\n${section("findings", findings)}\n}\n`;
};

export const buildMasterFindings = function buildMasterFindings(modules: readonly ModuleFindings[]): string {
    const sorted = modules.toSorted(byModuleName);
    const all = sorted.flatMap((entry) => entry.findings.map((finding) => ({ module: entry.module, ...finding })));
    const perModule = sorted
        .map((entry) => ({ byKind: byKind(entry.findings), module: entry.module, total: entry.findings.length }))
        .filter((entry) => entry.total > 0)
        .sort((left, right) => right.total - left.total || byModuleName(left, right));
    const summary = {
        byKind: tally(all, (finding) => finding.kind),
        bySeverity: tally(all, (finding) => finding.severity),
        findings: all.length,
        modules: modules.length,
    };
    return `{\n"summary": ${JSON.stringify(summary)},\n${section("modules", perModule)},\n${section("findings", all)}\n}\n`;
};

export const buildAnalysis = function buildAnalysis(model: AnalysisModel): string {
    const { insight, graph, findingsCount, title } = model;
    const summary = {
        definitions: insight.definitions,
        edges: graph.edges.length,
        findings: findingsCount,
        resolutionRate: resolutionRate(graph.edges.length, graph.external.length),
        unresolvedCalls: graph.external.length,
    };
    const body = [
        section("unresolvedCalls", unresolvedNames(graph)),
        section("definitions", definitionRecords(insight, graph)),
        section("edges", sortedEdges(graph)),
    ].join(",\n");
    return `{\n"module": ${JSON.stringify(title)},\n"summary": ${JSON.stringify(summary)},\n${body}\n}\n`;
};
