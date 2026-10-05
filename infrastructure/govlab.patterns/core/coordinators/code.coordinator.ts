import type { CodeFinding, CodeSymbol, DiagnoseInput } from "#types/code.types";
import { deadFindings, duplicateFindings } from "#core/analyzers/definition.analyzer";
import { callCycleFindings } from "#core/analyzers/dependency.analyzer";
import { crossConcernFindings } from "#core/analyzers/concern.analyzer";

export const diagnose = function diagnose(symbols: readonly CodeSymbol[], input: DiagnoseInput): CodeFinding[] {
    return [
        ...callCycleFindings(input.graph.edges),
        ...deadFindings(symbols, input.records, input.testUses),
        ...duplicateFindings(symbols),
        ...crossConcernFindings(symbols, input.graph.edges),
    ].sort((left, right) => right.relevance - left.relevance);
};
