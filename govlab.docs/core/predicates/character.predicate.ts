import { DIGITS, LOWER_ALPHA, isAlpha, isDigit } from "@govlab/constants";

const LOWER_SET: ReadonlySet<string> = new Set(LOWER_ALPHA);
const HYPHEN = "-";
const DOUBLE_HYPHEN = "--";
const KEBAB_CHARS: ReadonlySet<string> = new Set([...LOWER_ALPHA, ...DIGITS, HYPHEN]);

export const isAsciiAlnum = function isAsciiAlnum(char: string): boolean {
    return isAlpha(char) || isDigit(char);
};

export const isAsciiLower = function isAsciiLower(char: string): boolean {
    return LOWER_SET.has(char);
};

const isKebabChar = function isKebabChar(char: string): boolean {
    return KEBAB_CHARS.has(char);
};

export const isKebab = function isKebab(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    if (value.startsWith(HYPHEN) || value.endsWith(HYPHEN) || value.includes(DOUBLE_HYPHEN)) {
        return false;
    }
    for (const char of value) {
        if (!isKebabChar(char)) {
            return false;
        }
    }
    return true;
};
