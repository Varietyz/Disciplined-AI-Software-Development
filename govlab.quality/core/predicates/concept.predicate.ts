import type { ResolvedConcern } from "#types/concern.types";

export const excludedByConcept = function excludedByConcept(
    canon: readonly string[],
    concernMap: ReadonlyMap<string, ResolvedConcern>,
): boolean {
    return canon.some((concept) => concernMap.get(concept)?.exclude === true);
};
