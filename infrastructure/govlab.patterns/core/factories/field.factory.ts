import { FieldAnalyzer } from "#core/analyzers/field.analyzer";

export const buildAnalyzers = function buildAnalyzers(
    mapping: ReadonlyMap<string, readonly string[]>,
): Map<string, FieldAnalyzer> {
    return new Map([...mapping].map(([field, representations]) => [field, new FieldAnalyzer(field, representations)]));
};
