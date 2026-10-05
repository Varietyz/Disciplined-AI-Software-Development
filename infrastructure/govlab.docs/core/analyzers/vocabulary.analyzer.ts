import { BANNED_TERMS } from "#configuration/constants/vocabulary.constants";
import type { BannedHit } from "#types/markdown.types";
import { isAsciiAlnum } from "#core/predicates/character.predicate";
import { proseLines } from "#core/parsers/markdown.parser";
import { stripInlineCode } from "#core/converters/markdown.converter";

const BLOCKQUOTE_MARK = ">";
const QUOTE_PAIRS: readonly (readonly [string, string])[] = [
    ['"', '"'],
    ["“", "”"],
];

const isStandalone = function isStandalone(lower: string, from: number, term: string): boolean {
    const before = from > 0 ? lower.charAt(from - 1) : "";
    const after = lower.charAt(from + term.length);
    return !isAsciiAlnum(before) && !isAsciiAlnum(after);
};

const termHits = function termHits(lower: string, lineNo: number, term: string): BannedHit[] {
    const hits: BannedHit[] = [];
    let from = lower.indexOf(term);
    while (from !== -1) {
        if (isStandalone(lower, from, term)) {
            hits.push({ col: from + 1, line: lineNo, term });
        }
        from = lower.indexOf(term, from + term.length);
    }
    return hits;
};

const blankPair = function blankPair(line: string, open: string, close: string): string {
    let out = "";
    let from = 0;
    while (from < line.length) {
        const start = line.indexOf(open, from);
        const end = start === -1 ? -1 : line.indexOf(close, start + open.length);
        if (end === -1) {
            return out + line.slice(from);
        }
        out += line.slice(from, start) + " ".repeat(end + close.length - start);
        from = end + close.length;
    }
    return out;
};

const stripQuotedText = function stripQuotedText(line: string): string {
    return QUOTE_PAIRS.reduce((text, [open, close]) => blankPair(text, open, close), line);
};

export const bannedLanguage = function bannedLanguage(
    source: string,
    terms: readonly string[] = BANNED_TERMS,
): BannedHit[] {
    return proseLines(source)
        .filter(({ line }) => !line.trimStart().startsWith(BLOCKQUOTE_MARK))
        .flatMap(({ line, lineNo }) => {
            const prose = stripQuotedText(stripInlineCode(line)).toLowerCase();
            return terms.flatMap((term) => termHits(prose, lineNo, term));
        });
};
