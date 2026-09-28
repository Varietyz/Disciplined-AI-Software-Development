import { DERIVED_NOUNS } from "../constants/checklist.constants.ts";
import { isDigit } from "../resolvers/checklist.resolver.ts";

interface CountLiteral {
    readonly line: number;
    readonly numeral: string;
    readonly noun: string;
}

const FENCE = "```";

const SPAN_DELIMITERS = new Set(["`", '"']);

const SPAN_BREAK = " ";

const DECIMAL_POINT = ".";

const unspanned = function unspanned(line: string): string {
    let out = "";
    let span: string | null = null;

    for (const char of line) {
        if (span !== null) {
            span = char === span ? null : span;
        } else if (SPAN_DELIMITERS.has(char)) {
            span = char;
            out += SPAN_BREAK;
        } else {
            out += char;
        }
    }

    return out;
};

const isLetter = function isLetter(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
};

const wordishAt = function wordishAt(text: string, index: number): boolean {
    const char = text.charAt(index);
    if (char === DECIMAL_POINT) {
        return isDigit(text.charAt(index - 1)) && isDigit(text.charAt(index + 1));
    }
    return isDigit(char) || isLetter(char) || char === "-";
};

const wordsIn = function wordsIn(line: string): string[] {
    const text = unspanned(line);
    const out: string[] = [];
    let current = "";

    for (let index = 0; index < text.length; index += 1) {
        if (wordishAt(text, index)) {
            current += text.charAt(index);
        } else {
            out.push(...(current.length > 0 ? [current] : []));
            current = "";
        }
    }

    return [...out, ...(current.length > 0 ? [current] : [])];
};

const isNumeral = function isNumeral(word: string): boolean {
    for (const char of word) {
        if (!isDigit(char)) {
            return false;
        }
    }
    return word.length > 0;
};

const isDerivedNoun = function isDerivedNoun(word: string): boolean {
    return DERIVED_NOUNS.includes(word.toLowerCase());
};

const countsIn = function countsIn(words: readonly string[], line: number): CountLiteral[] {
    return words.slice(0, -1).flatMap((numeral, position) => {
        const noun = words[position + 1] ?? "";
        return isNumeral(numeral) && isDerivedNoun(noun) ? [{ line, noun, numeral }] : [];
    });
};

export const countLiterals = function countLiterals(lines: readonly string[]): CountLiteral[] {
    const out: CountLiteral[] = [];
    let fenced = false;

    for (const [index, line] of lines.entries()) {
        const fence = line.trimStart().startsWith(FENCE);
        if (!fence && !fenced) {
            out.push(...countsIn(wordsIn(line), index + 1));
        }
        fenced = fence ? !fenced : fenced;
    }

    return out;
};
