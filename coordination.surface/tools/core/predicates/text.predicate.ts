const QUOTE_MARKS = new Set(['"', "'"]);

const WORD_BREAKS = new Set([" ", "\t"]);

export const contains = function contains(haystack: string, needle: string): boolean {
    return haystack.includes(needle);
};

const flushed = function flushed(words: readonly string[], current: string): string[] {
    return current.length > 0 ? [...words, current] : [...words];
};

export const splitWords = function splitWords(text: string): string[] {
    let words: string[] = [];
    let current = "";
    let quote = "";

    for (const char of text) {
        if (quote !== "") {
            quote = char === quote ? "" : quote;
            current += quote === "" ? "" : char;
        } else if (QUOTE_MARKS.has(char)) {
            quote = char;
        } else if (WORD_BREAKS.has(char)) {
            words = flushed(words, current);
            current = "";
        } else {
            current += char;
        }
    }

    return flushed(words, current);
};

export const hasPrefix = function hasPrefix(text: string, prefix: string): boolean {
    return text.startsWith(prefix);
};

const isDigitCharacter = function isDigitCharacter(char: string): boolean {
    return char >= "0" && char <= "9";
};

export const leadingInteger = function leadingInteger(text: string): number {
    const trimmed = text.trimStart();
    let end = 0;
    while (end < trimmed.length && isDigitCharacter(trimmed.charAt(end))) {
        end += 1;
    }
    return end === 0 ? Number.NaN : Number(trimmed.slice(0, end));
};
