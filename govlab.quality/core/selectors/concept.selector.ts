import type { QualityData } from "#types/catalog.types";
import { loadQualityData } from "#core/loaders/quality.loader";

export const validConcepts = function validConcepts(data: QualityData = loadQualityData()): Set<string> {
    return new Set(data.rules.flatMap((rule) => rule.canonical ?? []));
};
