import { CONCEPT_PREFIX } from "#configuration/constants/canon.constants";
import { loadQualityData } from "#core/loaders/quality.loader";

export const buildCanonIndex = function buildCanonIndex(): Map<string, string[]> {
    const index = new Map<string, string[]>();
    for (const rule of loadQualityData().rules) {
        const refs = (rule.canonical ?? []).map((concept) => `${CONCEPT_PREFIX}${concept}`);
        if (refs.length > 0) {
            index.set(rule.ruleId, [...new Set([...(index.get(rule.ruleId) ?? []), ...refs])]);
        }
    }
    return index;
};

export const canonFor = function canonFor(ruleId: string, index: ReadonlyMap<string, string[]>): string[] {
    const bare = ruleId.slice(ruleId.lastIndexOf("/") + 1);
    return index.get(ruleId) ?? index.get(bare) ?? [];
};
