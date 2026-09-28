import { isWordCharacter } from "../predicates/token.predicate.ts";

const QUOTES = new Set(["'", '"', "`"]);

const ESCAPE = "\\";

const BRACE_DELTA = new Map([
    ["{", 1],
    ["}", -1],
]);

interface QuoteState {
    readonly quote: string;
    readonly escaped: boolean;
}

interface MaskStep extends QuoteState {
    readonly code: boolean;
}

export const isWordChar = function isWordChar(char: string): boolean {
    return isWordCharacter(char) || char === "$";
};

const isLetter = function isLetter(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
};

const isAllLetters = function isAllLetters(text: string): boolean {
    for (const character of text) {
        if (!isLetter(character)) {
            return false;
        }
    }
    return true;
};

const maskStep = function maskStep(state: QuoteState, char: string): MaskStep {
    if (state.quote === "") {
        return QUOTES.has(char) ? { code: false, escaped: false, quote: char } : { ...state, code: true };
    }
    if (state.escaped) {
        return { ...state, code: false, escaped: false };
    }
    return { code: false, escaped: char === ESCAPE, quote: char === state.quote ? "" : state.quote };
};

export const codeMask = function codeMask(source: string): boolean[] {
    const mask: boolean[] = [];
    let state: QuoteState = { escaped: false, quote: "" };

    for (let index = 0; index < source.length; index += 1) {
        const step = maskStep(state, source.charAt(index));
        mask.push(step.code);
        state = step;
    }

    return mask;
};

export const matchesAt = function matchesAt(source: string, index: number, word: string): boolean {
    if (!source.startsWith(word, index)) {
        return false;
    }
    if (index > 0 && isWordChar(source.charAt(index - 1))) {
        return false;
    }
    return !isWordChar(source.charAt(index + word.length));
};

export const spacesFrom = function spacesFrom(source: string, from: number): number {
    let cursor = from;
    while (cursor < source.length && source.charAt(cursor) === " ") {
        cursor += 1;
    }
    return cursor;
};

export const wordFrom = function wordFrom(source: string, from: number): string {
    let cursor = from;
    while (cursor < source.length && isWordChar(source.charAt(cursor))) {
        cursor += 1;
    }
    return source.slice(from, cursor);
};

export const identifiersIn = function identifiersIn(text: string): string[] {
    const mask = codeMask(text);
    const out: string[] = [];
    let held = "";

    for (let index = 0; index < text.length; index += 1) {
        const char = text.charAt(index);
        if (mask[index] === true && isWordChar(char)) {
            held += char;
        } else {
            out.push(...(held.length > 0 ? [held] : []));
            held = "";
        }
    }

    return [...out, ...(held.length > 0 ? [held] : [])];
};

export const memberValue = function memberValue(trimmed: string): string {
    const colon = trimmed.indexOf(":");
    if (colon <= 0) {
        return "";
    }
    const raw = trimmed.slice(colon + 1).trim();
    const value = raw.endsWith(",") ? raw.slice(0, -1).trim() : raw;
    return isAllLetters(value) ? value : "";
};

export const memberKey = function memberKey(trimmed: string): string {
    const colon = trimmed.indexOf(":");
    const key = colon <= 0 ? "" : trimmed.slice(0, colon).trim();
    return isAllLetters(key) ? key : "";
};

export const braceDelta = function braceDelta(line: string): number {
    let delta = 0;
    for (const character of line) {
        delta += BRACE_DELTA.get(character) ?? 0;
    }
    return delta;
};
