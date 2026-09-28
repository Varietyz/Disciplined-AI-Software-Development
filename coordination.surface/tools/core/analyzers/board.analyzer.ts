import type { AddressingSite, BoardRecord, RecordKind } from "../types/board.types.ts";
import { fencedFlags } from "../predicates/fence.predicate.ts";
import { indexedStates } from "../inspectors/index.inspector.ts";
import { itemSpanFlags } from "./fence.analyzer.ts";

const AGENT_PREFIX = "Agent ";
const BROADCAST_META = "to:*";
const DIRECTED_OPENER = "To ";
const BROADCAST_OPENER = "To ALL";
const OPENER_PREVIEW = 24;
const LABEL_LIMIT = 24;
const CLOSE_MARKER = "└";
const MARKER_END = "END AGENT ";
const FIELD_INDENT = "  ";

export const fieldKeyAt = function fieldKeyAt(line: string): string {
    if (!line.startsWith(FIELD_INDENT) || line.charAt(FIELD_INDENT.length) === " ") {
        return "";
    }

    const trimmed = line.trim();
    const colon = trimmed.indexOf(":");
    if (colon <= 0) {
        return "";
    }

    const key = trimmed.slice(0, colon);
    return key.includes(" ") ? "" : key;
};

export const unresolvedAddressing = function unresolvedAddressing(source: string): AddressingSite[] {
    const lines = source.split("\n");
    const out: AddressingSite[] = [];

    for (const [index, line] of lines.entries()) {
        const text = (lines[index + 1] ?? "").trim();
        const directed = text.startsWith(DIRECTED_OPENER) && !text.startsWith(BROADCAST_OPENER);
        if (line.includes(BROADCAST_META) && directed) {
            out.push({ line: index + 1, opener: text.slice(0, OPENER_PREVIEW) });
        }
    }

    return out;
};

interface OpenRecord {
    readonly kind: RecordKind;
    readonly label: string;
    readonly state: string;
    readonly line: number;
    readonly fields: Map<string, string>;
}

const HEADINGS: ReadonlyMap<string, RecordKind> = new Map([
    ["Agent", "agent"],
    ["Gate", "gate"],
]);

const headingOf = function headingOf(line: string): { kind: RecordKind; label: string; state: string } | null {
    const trimmed = line.trim();
    const space = trimmed.indexOf(" ");
    if (space === -1) {
        return null;
    }

    const word = trimmed.slice(0, space);
    const kind = HEADINGS.get(word);
    if (kind === undefined) {
        return null;
    }

    const rest = trimmed.slice(space + 1);
    const dash = rest.indexOf("—");
    const label = dash === -1 ? rest.trim() : rest.slice(0, dash).trim();
    if (label.length === 0 || label.length > LABEL_LIMIT) {
        return null;
    }

    const state = dash === -1 ? "" : rest.slice(dash + 1).trim();
    return { kind, label: `${word} ${label}`, state };
};

const fieldOf = function fieldOf(line: string): { key: string; value: string } | null {
    if (!line.startsWith(FIELD_INDENT) || line.charAt(FIELD_INDENT.length) === " ") {
        return null;
    }

    const trimmed = line.trim();
    const colon = trimmed.indexOf(":");
    if (colon <= 0) {
        return null;
    }

    const key = trimmed.slice(0, colon).trim();
    return key.includes(" ") ? null : { key, value: trimmed.slice(colon + 1).trim() };
};

const closesRecord = function closesRecord(line: string, label: string): boolean {
    const trimmed = line.trim();
    const marks = trimmed.indexOf(MARKER_END);
    if (!trimmed.startsWith(CLOSE_MARKER) || marks === -1) {
        return false;
    }

    const named = trimmed.slice(marks + MARKER_END.length).trim();
    const space = label.indexOf(" ");
    const letter = space === -1 ? label : label.slice(space + 1).trim();
    return named === letter;
};

interface Advance {
    readonly current: OpenRecord | null;
    readonly done: OpenRecord | null;
}

const advance = function advance(current: OpenRecord | null, line: string, index: number): Advance {
    const heading = headingOf(line);
    if (heading !== null) {
        return { current: { ...heading, fields: new Map(), line: index + 1 }, done: current };
    }
    if (current === null) {
        return { current: null, done: null };
    }
    if (closesRecord(line, current.label)) {
        return { current: null, done: current };
    }
    const field = fieldOf(line);
    const fields = field === null ? current.fields : new Map([...current.fields, [field.key, field.value]]);
    return { current: { ...current, fields }, done: null };
};

const isListOrHeading = function isListOrHeading(line: string): boolean {
    const trimmed = line.trim();
    return trimmed.startsWith("#") || trimmed.startsWith("-");
};

export const boardRecords = function boardRecords(source: string): BoardRecord[] {
    const out: BoardRecord[] = [];
    const fenced = fencedFlags(source);
    const inItem = itemSpanFlags(source);
    let current: OpenRecord | null = null;

    for (const [index, line] of source.split("\n").entries()) {
        const skipped = fenced[index] === true || inItem[index] === true || isListOrHeading(line);
        const step: Advance = skipped ? { current, done: null } : advance(current, line, index);
        ({ current } = step);
        if (step.done !== null) {
            out.push(step.done);
        }
    }

    if (current !== null) {
        out.push(current);
    }
    return out;
};

export const ACTIVE_STATE = "ACTIVE";

export const seatState = function seatState(index: string): (letter: string, marker: string) => string {
    const bound = indexedStates(index);
    const allocating = index.trim().length > 0;

    return (letter: string, marker: string): string => (allocating ? (bound.get(letter) ?? "") : marker);
};

export const activeSeats = function activeSeats(board: string, index: string): string[] {
    const stateOf = seatState(index);
    return boardRecords(board)
        .filter((record) => record.kind === "agent")
        .map((record) => ({ letter: record.label.slice(AGENT_PREFIX.length).trim(), state: record.state }))
        .filter(({ letter, state }) => letter.length > 0 && stateOf(letter, state) === ACTIVE_STATE)
        .map(({ letter }) => letter);
};

export const activeAgents = function activeAgents(board: string, index: string): number {
    return activeSeats(board, index).length;
};
