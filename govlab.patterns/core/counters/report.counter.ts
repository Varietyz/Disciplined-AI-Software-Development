import type { MetricScope, ReportMetrics } from "#types/report.types";
import { maxOf, tally } from "#core/counters/base.counter";

const RATE_SCALE = 100;

export const resolutionRate = function resolutionRate(resolved: number, unresolved: number): number {
    const total = resolved + unresolved;
    return total === 0 ? 1 : Math.round((resolved / total) * RATE_SCALE) / RATE_SCALE;
};

export const metricsOf = function metricsOf(scope: MetricScope): ReportMetrics {
    return {
        callable: scope.symbols.filter((symbol) => symbol.callable).length,
        definitions: scope.symbols.length,
        edges: scope.edges.length,
        exported: scope.symbols.filter((symbol) => symbol.exported).length,
        findings: tally(scope.findings, (finding) => finding.kind),
        flows: tally(scope.symbols, (symbol) => symbol.flow),
        maxInDegree: maxOf(scope.symbols.map((symbol) => symbol.inDegree)),
        maxOutDegree: maxOf(scope.symbols.map((symbol) => symbol.outDegree)),
        resolutionRate: resolutionRate(scope.edges.length, scope.unresolved),
        unresolvedCalls: scope.unresolved,
    };
};
