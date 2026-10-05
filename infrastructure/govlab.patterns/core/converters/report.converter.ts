import type { AnalyzeReport, AnalyzeResult, Coverage } from "#types/record.types";
import type { AnalysisGraph } from "#core/models/graph.model";
import type { Finding } from "#types/finding.types";
import type { GraphDict } from "#types/graph.types";

const COVERAGE_SEP = "␟";

const coverageOf = function coverageOf(findings: readonly Finding[]): Coverage {
    const cells = new Set(
        findings.map((finding) => `${finding.coordinate.ontology}${COVERAGE_SEP}${finding.coordinate.analysis}`),
    );
    const filled = [...cells].sort((a, b) => a.localeCompare(b)).map((cell) => cell.split(COVERAGE_SEP));
    return { counts: { filled: cells.size, findings: findings.length }, filled };
};

export const graphToDict = function graphToDict(graph: AnalysisGraph): GraphDict {
    return { edges: graph.nodes.reduce((sum, node) => sum + node.inputs.length, 0), nodes: [...graph.nodes] };
};

export const toReport = function toReport(records: number, result: AnalyzeResult): AnalyzeReport {
    return {
        coverage: coverageOf(result.findings),
        findings: result.findings,
        graph: graphToDict(result.graph),
        headline: { fields: result.schema.length, findings: result.findings.length, records },
        schema: result.schema,
    };
};
