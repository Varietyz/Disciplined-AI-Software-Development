import {
    FILED_OPENINGS,
    FOLDER_CLOSE,
    MIRRORED_CLAUSE,
    REFUSAL_OPENING,
    SAME_NAME_CLAUSES,
    TAG_SUFFIX,
} from "#configuration/constants/lexicon.constants";
import type { Term } from "#types/lexicon.types";

export const tagOfTerm = function tagOfTerm(term: Term): string | null {
    return term.id.endsWith(TAG_SUFFIX) ? term.id.slice(0, -TAG_SUFFIX.length) : null;
};

const filedFolderOf = function filedFolderOf(definition: string): string | null {
    const opening = FILED_OPENINGS.find((candidate) => definition.includes(candidate));
    if (opening === undefined) {
        return null;
    }
    const rest = definition.slice(definition.indexOf(opening) + opening.length);
    const close = rest.indexOf(FOLDER_CLOSE);
    return close > 0 ? rest.slice(0, close) : null;
};

export const folderOfTerm = function folderOfTerm(term: Term): string | null {
    const filed = filedFolderOf(term.definition);
    if (filed !== null) {
        return filed;
    }
    return SAME_NAME_CLAUSES.some((clause) => term.definition.includes(clause)) ? tagOfTerm(term) : null;
};

export const isMirrored = function isMirrored(term: Term): boolean {
    return term.definition.includes(MIRRORED_CLAUSE);
};

export const statesPlacement = function statesPlacement(term: Term): boolean {
    return tagOfTerm(term) !== null && (folderOfTerm(term) !== null || isMirrored(term));
};

export const statesRefusal = function statesRefusal(term: Term): boolean {
    return term.definition.startsWith(REFUSAL_OPENING);
};
