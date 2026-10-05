import type { AnalyzeOptions, AnalyzeReport, AnalyzeResult } from "#types/record.types";
import { assemble, feed } from "#core/coordinators/field.coordinator";
import { buildAnalyzers } from "#core/factories/field.factory";
import { detectSchema } from "#core/analyzers/schema.analyzer";
import { graphOf } from "#core/factories/graph.factory";
import { inferMapping } from "#core/resolvers/representation.resolver";
import { toReport } from "#core/converters/report.converter";

export const analyze = function analyze(records: readonly unknown[], options: AnalyzeOptions = {}): AnalyzeResult {
    const schema = detectSchema(records, options.floatFields);
    const analyzers = buildAnalyzers(options.mapping ?? inferMapping(schema));
    feed(analyzers, records);
    const { nodes, findings } = assemble(analyzers);
    return { findings, graph: graphOf(nodes), schema };
};

export const report = function report(records: readonly unknown[], options: AnalyzeOptions = {}): AnalyzeReport {
    return toReport(records.length, analyze(records, options));
};
