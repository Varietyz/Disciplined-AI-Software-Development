import type { Term, TermFilter } from "#types/lexicon.types";

const isWanted = function isWanted(value: string | undefined): value is string {
    return typeof value === "string" && value.length > 0;
};

export const matchesTerm = function matchesTerm(term: Term, filter: TermFilter): boolean {
    if (isWanted(filter.kind) && term.kind !== filter.kind) {
        return false;
    }
    if (isWanted(filter.category) && term.category !== filter.category) {
        return false;
    }
    return !isWanted(filter.enforcedBy) || term.enforcedBy.includes(filter.enforcedBy);
};
