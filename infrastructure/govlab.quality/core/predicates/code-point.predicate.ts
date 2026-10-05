import { DIGITS, LOWER_ALPHA, UPPER_ALPHA } from "@govlab/constants";

const codesOf = function codesOf(chars: readonly string[]): Set<number> {
    return new Set(chars.map((ch) => ch.codePointAt(0) ?? -1));
};

const UPPER_CODES = codesOf(UPPER_ALPHA);
const LOWER_CODES = codesOf(LOWER_ALPHA);
const DIGIT_CODES = codesOf(DIGITS);
const ALPHA_CODES = new Set([...UPPER_CODES, ...LOWER_CODES]);
const ALPHANUMERIC_CODES = new Set([...ALPHA_CODES, ...DIGIT_CODES]);
const IDENT_CODES = new Set([...ALPHANUMERIC_CODES, ...codesOf(["_", "$"])]);
const SNAKE_TAIL_CODES = new Set([...DIGIT_CODES, ...codesOf(["_"])]);
const CSS_NAME_CODES = new Set([...ALPHANUMERIC_CODES, ...codesOf(["-", "_"])]);
const KEBAB_CODES = new Set([...LOWER_CODES, ...DIGIT_CODES, ...codesOf(["-"])]);
const DOT_CODES = codesOf(["."]);

const inSet = function inSet(codes: ReadonlySet<number>, code: number | undefined): boolean {
    return typeof code === "number" && codes.has(code);
};

export const isAsciiUpper = (code: number | undefined): boolean => inSet(UPPER_CODES, code);

export const isAsciiLower = (code: number | undefined): boolean => inSet(LOWER_CODES, code);

export const isAsciiAlpha = (code: number | undefined): boolean => inSet(ALPHA_CODES, code);

export const isAsciiDigit = (code?: number): boolean => inSet(DIGIT_CODES, code);

export const isKebabChar = (code: number | undefined): boolean => inSet(KEBAB_CODES, code);

export const isDot = (code: number | undefined): boolean => inSet(DOT_CODES, code);

export const isIdentChar = (code: number | undefined): boolean => inSet(IDENT_CODES, code);

export const isSnakeTail = (code: number | undefined): boolean => inSet(SNAKE_TAIL_CODES, code);

export const isCssNameChar = (code: number | undefined): boolean => inSet(CSS_NAME_CODES, code);
