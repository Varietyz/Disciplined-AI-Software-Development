import type { Frontmatter, FrontmatterFields } from "#types/metadata.types";
import { FRONTMATTER_FENCE } from "#configuration/constants/document.constants";
import { splitLines } from "#core/parsers/markdown.parser";

const LIST_OPEN = "[";
const LIST_CLOSE = "]";
const LIST_SEPARATOR = ",";
const KEY_SEPARATOR = ":";
const TOKEN_SEPARATORS: ReadonlySet<string> = new Set([
    "[",
    "]",
    ",",
    ":",
    " ",
    "\t",
    "\r",
    '"',
    "'",
    "(",
    ")",
    "`",
    "<",
    ">",
]);

const ABSENT: Frontmatter = { bodyStart: 0, fields: {}, present: false };

const parseFields = function parseFields(lines: readonly string[]): FrontmatterFields {
    const fields: Record<string, string> = {};
    for (let at = 1; at < lines.length; at += 1) {
        const line = lines[at] ?? "";
        if (line === FRONTMATTER_FENCE) {
            return { end: at, fields };
        }
        const colon = line.indexOf(KEY_SEPARATOR);
        if (colon > 0) {
            fields[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
        }
    }
    return { end: -1, fields };
};

export const listValues = function listValues(raw: string): string[] | null {
    const value = raw.trim();
    if (!value.startsWith(LIST_OPEN) || !value.endsWith(LIST_CLOSE)) {
        return null;
    }
    const inner = value.slice(1, -1).trim();
    if (inner.length === 0) {
        return [];
    }
    return inner
        .split(LIST_SEPARATOR)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
};

export const parseFrontmatter = function parseFrontmatter(source: string): Frontmatter {
    const lines = splitLines(source);
    if ((lines[0] ?? "") !== FRONTMATTER_FENCE) {
        return ABSENT;
    }
    const { fields, end } = parseFields(lines);
    return end === -1 ? ABSENT : { bodyStart: end + 1, fields, present: true };
};

export const fieldLine = function fieldLine(source: string, field: string): number {
    const lines = splitLines(source);
    for (let at = 0; at < lines.length; at += 1) {
        const line = lines[at] ?? "";
        const colon = line.indexOf(KEY_SEPARATOR);
        if (colon > 0 && line.slice(0, colon).trim() === field) {
            return at + 1;
        }
    }
    return 1;
};

export const splitOn = function splitOn(text: string, isSeparator: (char: string) => boolean): string[] {
    const tokens: string[] = [];
    let current = "";
    for (const char of text) {
        if (!isSeparator(char)) {
            current += char;
            continue;
        }
        if (current.length > 0) {
            tokens.push(current);
            current = "";
        }
    }
    return current.length > 0 ? [...tokens, current] : tokens;
};

export const fileTokens = function fileTokens(line: string): string[] {
    return splitOn(line, (char) => TOKEN_SEPARATORS.has(char));
};
