import { ACTIVE_STATE, seatState } from "../analyzers/board.analyzer.ts";
import type { SpanConflict } from "../types/board.types.ts";
import { blockOf } from "../transformers/board.transformer.ts";

const INACTIVE = "INACTIVE";
const AGENT_HEADING = "Agent ";

const headingLetter = function headingLetter(trimmed: string): string {
    const rest = trimmed.slice(AGENT_HEADING.length).trim();
    const space = rest.indexOf(" ");
    return space === -1 ? rest : rest.slice(0, space);
};

export const activeLetters = function activeLetters(source: string, index: string): ReadonlySet<string> {
    const stateOf = seatState(index);
    const active = source
        .split("\n")
        .map((line) => line.trim())
        .filter((trimmed) => trimmed.startsWith(AGENT_HEADING))
        .map((trimmed) => ({
            letter: headingLetter(trimmed),
            marker: trimmed.includes(INACTIVE) ? INACTIVE : ACTIVE_STATE,
        }))
        .filter(({ letter, marker }) => letter.length > 0 && stateOf(letter, marker) === ACTIVE_STATE)
        .map(({ letter }) => letter);

    return new Set(active);
};

const spanLines = function spanLines(source: string, agent: string): string[] | null {
    const span = blockOf(source, agent);
    if (span === null) {
        return null;
    }

    return source.split("\n").slice(span.from - 1, span.to);
};

const difference = function difference(from: readonly string[], against: readonly string[]): string[] {
    const held = new Set(against);
    return from.filter((line) => !held.has(line) && line.trim().length > 0);
};

export const dropItemSpan = function dropItemSpan(
    source: string,
    key: string,
): { text: string; removed: number } | null {
    const span = blockOf(source, key);
    if (span === null) {
        return null;
    }

    const lines = source.split("\n");
    const kept = [...lines.slice(0, span.from - 1), ...lines.slice(span.to)];

    return { removed: lines.slice(span.from - 1, span.to).join("\n").length, text: kept.join("\n") };
};

export const compareSpans = function compareSpans(before: string, witness: string, agent: string): SpanConflict {
    const was = spanLines(before, agent);
    const now = spanLines(witness, agent);

    if (was === null || now === null) {
        return { added: [], overlapping: true, removed: [] };
    }

    const added = difference(now, was);
    const removed = difference(was, now);

    return { added, overlapping: added.length > 0 || removed.length > 0, removed };
};
