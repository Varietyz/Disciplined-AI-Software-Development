import { at, endOfQuoted } from "./comment.predicate.ts";
import type { Literal } from "../types/literal.types.ts";

const QUOTES = new Set(['"', "'", "`"]);

const newlinesIn = function newlinesIn(text: string): number {
    return text.split("\n").length - 1;
};

export const stringLiterals = function stringLiterals(source: string): Literal[] {
    const out: Literal[] = [];
    let cursor = 0;
    let line = 1;

    while (cursor < source.length) {
        const char = at(source, cursor);
        if (QUOTES.has(char)) {
            const end = endOfQuoted(source, cursor + 1, char);
            out.push({ line, value: source.slice(cursor + 1, Math.max(cursor + 1, end - 1)) });
            line += newlinesIn(source.slice(cursor, end));
            cursor = end;
        } else {
            line += char === "\n" ? 1 : 0;
            cursor += 1;
        }
    }

    return out;
};
