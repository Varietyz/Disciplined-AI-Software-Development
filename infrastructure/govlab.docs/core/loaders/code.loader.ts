import type { Analyzer } from "#types/code.types";
import { absolutePath } from "@ssot/paths";
import { isRecord } from "#core/predicates/record.predicate";
import { loadExports } from "#core/loaders/plugin.loader";

const EXPORT_KEY = "analyzer";

const isAnalyzer = function isAnalyzer(value: unknown): value is Analyzer {
    return isRecord(value) && typeof value["ecosystem"] === "string";
};

export const loadAnalyzers = async function loadAnalyzers(): Promise<Analyzer[]> {
    const analyzers = await loadExports(absolutePath("govlab.docs.plugins"), EXPORT_KEY, isAnalyzer);
    return analyzers.toSorted((left, right) => left.ecosystem.localeCompare(right.ecosystem));
};
