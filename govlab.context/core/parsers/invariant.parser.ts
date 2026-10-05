import {
    INVARIANT_OBJECTOR,
    INVARIANT_PARTIES,
    INVARIANT_PREFIX,
    INVARIANT_SET,
} from "#configuration/constants/grammar.constants";
import type { PagInvariant } from "#types/grammar.document.types";

const CLAUSE_MARKERS = [INVARIANT_SET, INVARIANT_PARTIES, INVARIANT_OBJECTOR];
const NAME_END = ":";

const clauseOf = function clauseOf(text: string, marker: string): string | null {
    const at = text.indexOf(marker);
    if (at === -1) {
        return null;
    }
    const start = at + marker.length;
    const ends = CLAUSE_MARKERS.map((other) => (other === marker ? -1 : text.indexOf(other, start))).filter(
        (index) => index !== -1,
    );
    return text.slice(start, ends.length === 0 ? text.length : Math.min(...ends)).trim();
};

const propertyOf = function propertyOf(afterName: string): string {
    const ends = CLAUSE_MARKERS.map((marker) => afterName.indexOf(marker)).filter((index) => index !== -1);
    return (ends.length === 0 ? afterName : afterName.slice(0, Math.min(...ends))).trim();
};

export const parseInvariant = function parseInvariant(text: string, line: number): PagInvariant {
    const body = text.slice(INVARIANT_PREFIX.length);
    const colon = body.indexOf(NAME_END);
    const afterName = colon === -1 ? "" : body.slice(colon + 1);
    return {
        line,
        name: (colon === -1 ? body : body.slice(0, colon)).trim(),
        objector: clauseOf(afterName, INVARIANT_OBJECTOR),
        parties: clauseOf(afterName, INVARIANT_PARTIES),
        property: propertyOf(afterName),
        set: clauseOf(afterName, INVARIANT_SET),
    };
};
