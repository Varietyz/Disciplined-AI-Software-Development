import type { ClauseLine, DeferredSection } from "../types/converge.types.ts";
import { fencedFlags } from "../predicates/fence.predicate.ts";

export const SIGN_OFF_ABSENT = "—";

export const PLACEHOLDER = "<";

const LIST_ITEM = "- ";

const EMPHASIS = ["*", "`", "_"];

const SUCCESSOR_FIELD = "SUCCESSOR:";

const CLAUSE_ARROW = "→";

const BANNER = "═";

const DEFERRED_HEADING = "DEFERRED";

export const DEFERRED_SECTION = DEFERRED_HEADING;

export const DEFERRAL_ARROW = CLAUSE_ARROW;

interface ClauseSection {
    readonly declared: boolean;
    readonly answered: boolean;
    readonly lines: readonly ClauseLine[];
}

const isDigit = function isDigit(character: string): boolean {
    return character >= "0" && character <= "9";
};

const isHeadingCharacter = function isHeadingCharacter(character: string): boolean {
    return (character >= "a" && character <= "z") || isDigit(character) || character === "-";
};

export const declaredHeading = function declaredHeading(field: string): string {
    return field.trim();
};

export const headingIsWhole = function headingIsWhole(field: string): boolean {
    const trimmed = field.trim();
    for (const character of trimmed) {
        if (!isHeadingCharacter(character)) {
            return false;
        }
    }
    return trimmed.length > 0;
};

export const declaredSuccessor = function declaredSuccessor(venue: string): string {
    const fenced = fencedFlags(venue);
    const line = venue
        .split("\n")
        .find((text, index) => fenced[index] !== true && text.trim().startsWith(SUCCESSOR_FIELD));
    const value = line === undefined ? "" : line.trim().slice(SUCCESSOR_FIELD.length).trim();
    return value.startsWith(PLACEHOLDER) ? "" : value;
};

const receiverOf = function receiverOf(line: string): string {
    const arrow = line.indexOf(CLAUSE_ARROW);
    if (arrow === -1) {
        return "";
    }

    const rest = line.slice(arrow + CLAUSE_ARROW.length).trim();
    const comma = rest.indexOf(",");
    return (comma === -1 ? rest : rest.slice(0, comma)).trim();
};

const unemphasised = function unemphasised(text: string): string {
    let held = text;
    for (const mark of EMPHASIS) {
        held = held.replaceAll(mark, "");
    }
    return held.trim();
};

const isSectionBoundary = function isSectionBoundary(trimmed: string): boolean {
    return trimmed.startsWith("#") || trimmed.startsWith(BANNER);
};

export const sectionBound = function sectionBound(venue: string, heading: string): { from: number; to: number } | null {
    const lines = venue.split("\n");
    const boundaries = [...lines.keys()].filter((index) => isSectionBoundary((lines[index] ?? "").trim()));
    const from = boundaries.find((index) => (lines[index] ?? "").includes(heading));
    if (from === undefined) {
        return null;
    }
    return { from, to: boundaries.find((index) => index > from) ?? lines.length };
};

const clauseOf = function clauseOf(trimmed: string): string {
    const arrow = trimmed.indexOf(CLAUSE_ARROW);
    return unemphasised(arrow === -1 ? trimmed.slice(LIST_ITEM.length) : trimmed.slice(LIST_ITEM.length, arrow));
};

const isStatedClause = function isStatedClause(clause: string): boolean {
    return clause.length > 0 && !clause.startsWith(PLACEHOLDER) && clause !== SIGN_OFF_ABSENT;
};

const opensSection = function opensSection(trimmed: string, heading: string): boolean {
    return isSectionBoundary(trimmed) && trimmed.includes(heading);
};

const insideFlags = function insideFlags(lines: readonly string[], heading: string): boolean[] {
    const out: boolean[] = [];
    let inside = false;

    for (const trimmed of lines) {
        out.push(inside);
        inside = opensSection(trimmed, heading) || (inside && !isSectionBoundary(trimmed));
    }

    return out;
};

const clauseSection = function clauseSection(venue: string, heading: string): ClauseSection {
    const lines = venue.split("\n").map((line) => line.trim());
    const inside = insideFlags(lines, heading);
    const items = lines.filter(
        (trimmed, index) => inside[index] === true && !isSectionBoundary(trimmed) && trimmed.startsWith(LIST_ITEM),
    );

    return {
        answered: items.some((trimmed) => {
            const clause = clauseOf(trimmed);
            return isStatedClause(clause) || clause === SIGN_OFF_ABSENT;
        }),
        declared: lines.some((trimmed) => opensSection(trimmed, heading)),
        lines: items.flatMap((trimmed) => {
            const clause = clauseOf(trimmed);
            return isStatedClause(clause) ? [{ clause, receiver: receiverOf(trimmed) }] : [];
        }),
    };
};

export const deferredClauses = function deferredClauses(venue: string): DeferredSection {
    const section = clauseSection(venue, DEFERRED_SECTION);
    return {
        answered: section.answered,
        clauses: section.lines.map((entry) => entry.clause),
        declared: section.declared,
    };
};

export const clauseLines = function clauseLines(venue: string, heading: string): readonly ClauseLine[] {
    return clauseSection(venue, heading).lines;
};
