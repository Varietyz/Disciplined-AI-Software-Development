import type { Delimiter } from "../types/board.types.ts";
import { fencedFlags } from "../predicates/fence.predicate.ts";

const OPEN_MARKER = "┌";
const CLOSE_MARKER = "└";
const MARKER_AGENT = "AGENT ";
const MARKER_END = "END AGENT ";
const ORDINAL_SEPARATOR = "-";

interface Span {
    readonly agent: string;
    readonly from: number;
    readonly to: number;
}

const isUpper = function isUpper(char: string): boolean {
    return char >= "A" && char <= "Z";
};

const isLower = function isLower(char: string): boolean {
    return char >= "a" && char <= "z";
};

const isDigit = function isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
};

const runEnd = function runEnd(text: string, from: number, accepts: (char: string) => boolean): number {
    let cursor = from;
    while (cursor < text.length && accepts(text.charAt(cursor))) {
        cursor += 1;
    }
    return cursor;
};

const agentAfter = function agentAfter(text: string, marker: string): string | null {
    const at = text.indexOf(marker);
    if (at === -1) {
        return null;
    }
    const start = at + marker.length;
    const upperEnd = runEnd(text, start, isUpper);
    if (upperEnd === start) {
        return null;
    }
    const nameEnd = runEnd(text, upperEnd, isLower);
    const name = text.slice(start, nameEnd);
    if (text.charAt(nameEnd) !== ORDINAL_SEPARATOR) {
        return name;
    }
    const ordinalEnd = runEnd(text, nameEnd + 1, isDigit);
    return ordinalEnd === nameEnd + 1 ? name : `${name}${ORDINAL_SEPARATOR}${text.slice(nameEnd + 1, ordinalEnd)}`;
};

const delimiterOf = function delimiterOf(line: string, index: number): Delimiter | null {
    if (line.startsWith(OPEN_MARKER)) {
        const agent = agentAfter(line, MARKER_AGENT);
        return agent === null ? null : { agent, line: index + 1, open: true };
    }
    if (line.startsWith(CLOSE_MARKER)) {
        const agent = agentAfter(line, MARKER_END);
        return agent === null ? null : { agent, line: index + 1, open: false };
    }
    return null;
};

export const delimitersIn = function delimitersIn(source: string): Delimiter[] {
    const out: Delimiter[] = [];
    const fenced = fencedFlags(source);

    for (const [index, line] of source.split("\n").entries()) {
        const delimiter = fenced[index] === true ? null : delimiterOf(line.trim(), index);
        if (delimiter !== null) {
            out.push(delimiter);
        }
    }

    return out;
};

const spansOf = function spansOf(source: string): Span[] {
    const spans: Span[] = [];
    const open = new Map<string, number>();

    for (const delimiter of delimitersIn(source)) {
        if (delimiter.open) {
            open.set(delimiter.agent, delimiter.line);
            continue;
        }
        const from = open.get(delimiter.agent);
        if (from !== undefined) {
            open.delete(delimiter.agent);
            spans.push({ agent: delimiter.agent, from, to: delimiter.line });
        }
    }

    return spans;
};

export const enclosingRecord = function enclosingRecord(source: string): (line: number) => string | null {
    const spans = spansOf(source);

    return (line: number): string | null => {
        let held: string | null = null;
        let width = Number.MAX_SAFE_INTEGER;

        for (const span of spans) {
            const size = span.to - span.from;
            if (line >= span.from && line <= span.to && size < width) {
                width = size;
                held = span.agent;
            }
        }

        return held;
    };
};

export const itemSpanFlags = function itemSpanFlags(source: string): boolean[] {
    const flags = source.split("\n").map(() => false);
    let openAt = -1;
    let openKey = "";

    for (const mark of delimitersIn(source)) {
        const isItem = mark.agent.includes(ORDINAL_SEPARATOR);
        const closesOpen = isItem && !mark.open && openAt !== -1 && mark.agent === openKey;
        if (isItem && mark.open && openAt === -1) {
            openAt = mark.line;
            openKey = mark.agent;
        }
        if (closesOpen) {
            flags.fill(true, openAt, mark.line - 1);
            openAt = -1;
            openKey = "";
        }
    }

    return flags;
};
