import type { Enumeration, Quoted } from "../types/literal.types.ts";
import { accumulate, isWordCharacter } from "../predicates/token.predicate.ts";
import { Buffer } from "node:buffer";
import { endOfQuoted } from "../predicates/comment.predicate.ts";

const MODULE_SUFFIX = ".ts";

const ENUMERATORS: ReadonlySet<string> = new Set(["readdirSync", "readdir", "walk"]);

const RECURSIVE_FLAG = "recursive";

const ESCAPING_ROOTS: ReadonlySet<string> = new Set(["repoRoot", "REPO_ROOT", "projectRoot"]);

const NARROWERS: ReadonlySet<string> = new Set(["surfacePrefix", "surfacePath", "surfaceRoot"]);

const OPEN = "(";

const CLOSE = ")";

const QUOTES: ReadonlySet<string> = new Set(['"', "'", "`"]);

const ESCAPE = "\\";

const TEMPLATE_QUOTE = "`";

const BLANKS: ReadonlySet<string> = new Set([" ", "\n"]);

const MEMBER_ACCESS = ".";

const SCANNED_QUOTES: ReadonlySet<string> = new Set(['"', "'"]);

export const lineOf = function lineOf(source: string, index: number): number {
    return source.slice(0, index).split("\n").length;
};

const argumentsOf = function argumentsOf(source: string, openAt: number): string {
    let depth = 0;
    let cursor = openAt;

    do {
        const character = source.charAt(cursor);
        depth += (character === OPEN ? 1 : 0) - (character === CLOSE ? 1 : 0);
        cursor += 1;
    } while (depth > 0 && cursor < source.length);

    return depth === 0 ? source.slice(openAt + 1, cursor - 1) : "";
};

const nameEndingAt = function nameEndingAt(source: string, openAt: number): string {
    let start = openAt;
    while (start > 0 && isWordCharacter(source.charAt(start - 1))) {
        start -= 1;
    }
    return source.slice(start, openAt);
};

const enumerationAt = function enumerationAt(source: string, openAt: number): Enumeration[] {
    if (!ENUMERATORS.has(nameEndingAt(source, openAt))) {
        return [];
    }

    const tokens = accumulate(argumentsOf(source, openAt), isWordCharacter);
    const escaping = tokens.find((token) => ESCAPING_ROOTS.has(token));
    const narrowed = tokens.some((token) => NARROWERS.has(token));
    if (!tokens.includes(RECURSIVE_FLAG) || escaping === undefined || narrowed) {
        return [];
    }
    return [{ line: lineOf(source, openAt), root: escaping }];
};

export const unboundedEnumerations = function unboundedEnumerations(source: string): Enumeration[] {
    const out: Enumeration[] = [];
    let cursor = 0;

    while (cursor < source.length) {
        const character = source.charAt(cursor);
        if (QUOTES.has(character)) {
            cursor = endOfQuoted(source, cursor + 1, character);
        } else {
            out.push(...(character === OPEN ? enumerationAt(source, cursor) : []));
            cursor += 1;
        }
    }

    return out;
};

export const isPathShaped = function isPathShaped(value: string): boolean {
    if (value.length === 0) {
        return false;
    }
    if (value.endsWith(MODULE_SUFFIX)) {
        return false;
    }
    if (Buffer.isEncoding(value)) {
        return false;
    }

    return !value.includes(" ");
};

const closingQuote = function closingQuote(source: string, start: number, quote: string): number {
    let cursor = start;
    let char = source.charAt(cursor);
    const endsLine = (at: string): boolean => at === "\n" && quote !== TEMPLATE_QUOTE;

    while (cursor < source.length && char !== quote && !endsLine(char)) {
        cursor += char === ESCAPE ? 2 : 1;
        char = source.charAt(cursor);
    }

    return char === quote && cursor < source.length ? cursor : -1;
};

export const callBefore = function callBefore(source: string, quoteAt: number): string {
    let cursor = quoteAt - 1;
    while (cursor >= 0 && BLANKS.has(source.charAt(cursor))) {
        cursor -= 1;
    }
    if (source.charAt(cursor) !== OPEN) {
        return "";
    }

    const name = nameEndingAt(source, cursor);
    return source.charAt(cursor - name.length - 1) === MEMBER_ACCESS ? "" : name;
};

export const quotedLiterals = function quotedLiterals(source: string): Quoted[] {
    const out: Quoted[] = [];
    let cursor = 0;

    while (cursor < source.length) {
        const char = source.charAt(cursor);
        const close = SCANNED_QUOTES.has(char) ? closingQuote(source, cursor + 1, char) : cursor;
        if (close === -1) {
            cursor = source.length;
        } else if (close === cursor) {
            cursor += 1;
        } else {
            out.push({ close, open: cursor, value: source.slice(cursor + 1, close) });
            cursor = close + 1;
        }
    }

    return out;
};
