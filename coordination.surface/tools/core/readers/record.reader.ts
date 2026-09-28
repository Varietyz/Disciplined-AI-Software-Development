import type { RecordDocument, RecordEntry } from "../types/record.types.ts";
import { accumulate } from "../predicates/token.predicate.ts";
import { unfencedLines } from "./document.reader.ts";

interface RecordState {
    readonly records: readonly RecordEntry[];
    readonly current: RecordEntry | null;
    readonly shape: string;
    readonly frontmatter: boolean;
}

const FRONTMATTER = "---";

const SHAPE_FIELD = "records:";

const RECORD_ANCHOR = "### ";

const INITIAL: RecordState = { current: null, frontmatter: false, records: [], shape: "typed" };

const closed = function closed(state: RecordState): readonly RecordEntry[] {
    return state.current === null ? state.records : [...state.records, state.current];
};

const keyedField = function keyedField(line: string): { key: string; value: string } | null {
    const colon = line.indexOf(":");
    const key = colon <= 0 ? "" : line.slice(0, colon);
    return key.length === 0 || key.includes(" ") ? null : { key, value: line.slice(colon + 1).trim() };
};

const bodyLine = function bodyLine(state: RecordState, line: string, number: number): RecordState {
    if (line.startsWith(RECORD_ANCHOR)) {
        return {
            ...state,
            current: { id: line.slice(RECORD_ANCHOR.length).trim(), keys: {}, line: number },
            records: closed(state),
        };
    }
    if (state.current === null) {
        return state;
    }
    if (line.startsWith("#")) {
        return { ...state, current: null, records: closed(state) };
    }

    const field = keyedField(line);
    return field === null
        ? state
        : { ...state, current: { ...state.current, keys: { ...state.current.keys, [field.key]: field.value } } };
};

const frontmatterLine = function frontmatterLine(state: RecordState, line: string): RecordState {
    return line.startsWith(SHAPE_FIELD) ? { ...state, shape: line.slice(SHAPE_FIELD.length).trim() } : state;
};

const stepped = function stepped(state: RecordState, line: string, number: number): RecordState {
    if (line === FRONTMATTER) {
        return { ...state, frontmatter: number === 1 };
    }
    return state.frontmatter ? frontmatterLine(state, line) : bodyLine(state, line, number);
};

export const readRecordDocument = function readRecordDocument(source: string): RecordDocument {
    let state = INITIAL;
    for (const { text, number } of unfencedLines(source)) {
        state = stepped(state, text, number);
    }
    return { records: closed(state), shape: state.shape };
};

const isCapital = function isCapital(char: string): boolean {
    return char >= "A" && char <= "Z";
};

const isDigit = function isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
};

const isIdChar = function isIdChar(char: string): boolean {
    return isCapital(char) || isDigit(char) || char === "-";
};

const countOf = function countOf(token: string, predicate: (char: string) => boolean): number {
    let count = 0;
    for (const char of token) {
        count += predicate(char) ? 1 : 0;
    }
    return count;
};

const isCitedId = function isCitedId(token: string): boolean {
    return token.includes("-") && token.length > 4 && countOf(token, isDigit) >= 2 && countOf(token, isCapital) >= 2;
};

export const citedIds = function citedIds(value: string): string[] {
    return [...new Set(accumulate(value, isIdChar).filter(isCitedId))];
};
