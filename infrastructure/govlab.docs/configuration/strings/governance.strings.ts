export const LEAD_HEADING = "lead";

export const historySmell = function historySmell(term: string): string {
    return `"${term}" — state current truth only`;
};

export const hardcodedCount = function hardcodedCount(count: string): string {
    return `hardcoded count "${count}" — a volatile count goes stale; state the mechanism`;
};

export const unresolvedPrinciple = function unresolvedPrinciple(id: string): string {
    return `"${id}" resolves to no principle in @govlab/context`;
};

export const conflictingPrinciples = function conflictingPrinciples(id: string, other: string): string {
    return `"${id}" conflicts_with also-declared "${other}"`;
};

export const ambiguousPrinciple = function ambiguousPrinciple(id: string): string {
    return `"${id}" — resolve() is ambiguous`;
};

export const unresolvedConcept = function unresolvedConcept(id: string): string {
    return `"${id}" resolves to no canonical concept in @govlab/quality-relations`;
};
