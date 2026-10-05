import { CANONICAL_FORCES, FORCE_JOINER, SPELLING_GAPS } from "#configuration/constants/vocabulary.constants";

export const canonicalForceOf = function canonicalForceOf(token: string): string | null {
    let folded = "";
    for (const char of token.trim().toLowerCase()) {
        folded += SPELLING_GAPS.has(char) ? FORCE_JOINER : char;
    }
    return folded !== token && CANONICAL_FORCES.has(folded) ? folded : null;
};
