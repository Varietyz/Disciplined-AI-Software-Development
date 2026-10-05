import type { GraphDict, Node } from "#types/graph.types";
import type { AnalysisGraph } from "#core/models/graph.model";
import type { FieldSchema } from "#types/schema.types";
import type { Finding } from "#types/finding.types";

export interface LoadedData {
    records: unknown[];
    floatFields: Set<string>;
}

export interface AnalyzeOptions {
    floatFields?: ReadonlySet<string>;
    mapping?: ReadonlyMap<string, readonly string[]>;
}

export interface SynthesizeOptions extends AnalyzeOptions {
    count?: number;
    seed?: number;
}

export interface AnalyzeResult {
    schema: FieldSchema[];
    findings: Finding[];
    graph: AnalysisGraph;
}

export interface Coverage {
    filled: string[][];
    counts: { filled: number; findings: number };
}

export interface AnalyzeReport {
    schema: FieldSchema[];
    headline: { records: number; fields: number; findings: number };
    findings: Finding[];
    graph: GraphDict;
    coverage: Coverage;
}

export interface FieldOutput {
    nodes: Node[];
    findings: Finding[];
}

export interface WindowSnapshot {
    count: number;
    report: AnalyzeReport;
}
