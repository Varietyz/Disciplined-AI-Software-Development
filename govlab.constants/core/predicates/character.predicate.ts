import {
    DIGITS,
    IDENTIFIER_JOINER,
    LOWER_ALPHA,
    UPPER_ALPHA,
    WHITESPACE,
} from "#configuration/constants/character.constants";

const UPPER_SET = new Set<string>(UPPER_ALPHA);
const LOWER_SET = new Set<string>(LOWER_ALPHA);
const ALPHA_SET = new Set<string>([...UPPER_ALPHA, ...LOWER_ALPHA]);
const DIGIT_SET = new Set<string>(DIGITS);
const WHITESPACE_SET = new Set<string>(WHITESPACE);
const IDENTIFIER_SET = new Set<string>([...UPPER_ALPHA, ...LOWER_ALPHA, ...DIGITS, IDENTIFIER_JOINER]);

export const isUpperAlpha = function isUpperAlpha(char: string): boolean {
    return UPPER_SET.has(char);
};

export const isLowerAlpha = function isLowerAlpha(char: string): boolean {
    return LOWER_SET.has(char);
};

export const isAlpha = function isAlpha(char: string): boolean {
    return ALPHA_SET.has(char);
};

export const isDigit = function isDigit(char: string): boolean {
    return DIGIT_SET.has(char);
};

export const isWhitespace = function isWhitespace(char: string): boolean {
    return WHITESPACE_SET.has(char);
};

export const isIdentifierChar = function isIdentifierChar(char: string): boolean {
    return IDENTIFIER_SET.has(char);
};

export const everyChar = function everyChar(text: string, test: (char: string) => boolean): boolean {
    for (const char of text) {
        if (!test(char)) {
            return false;
        }
    }
    return true;
};
