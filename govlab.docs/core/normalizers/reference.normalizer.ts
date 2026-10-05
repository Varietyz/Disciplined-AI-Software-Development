import { isDigit } from "@govlab/constants";

const MIN_QUOTED_LEN = 2;
const QUOTES: readonly string[] = ['"', "'"];
const FRAGMENT_MARK = "#";
const TRAILING_SLASH = "/";
const LINE_SEPARATOR = ":";
const RANGE_MARK = "-";
const MAX_LINE_SUFFIX_PASSES = 2;

export const unquote = function unquote(target: string): string {
    const quoted =
        target.length >= MIN_QUOTED_LEN && QUOTES.some((quote) => target.startsWith(quote) && target.endsWith(quote));
    return quoted ? target.slice(1, -1) : target;
};

export const withoutFragment = function withoutFragment(target: string): string {
    const hash = target.indexOf(FRAGMENT_MARK);
    return hash === -1 ? target : target.slice(0, hash);
};

export const cleanTarget = function cleanTarget(rawPath: string): string {
    return withoutFragment(unquote(rawPath));
};

const isLineRef = function isLineRef(text: string): boolean {
    let sawDigit = false;
    for (const char of text) {
        if (!isDigit(char) && char !== RANGE_MARK) {
            return false;
        }
        sawDigit ||= isDigit(char);
    }
    return sawDigit;
};

const stripLineSuffix = function stripLineSuffix(target: string): string {
    let out = target;
    for (let pass = 0; pass < MAX_LINE_SUFFIX_PASSES; pass += 1) {
        const colon = out.lastIndexOf(LINE_SEPARATOR);
        if (colon > 0 && isLineRef(out.slice(colon + 1))) {
            out = out.slice(0, colon);
        }
    }
    return out;
};

export const normalizeTarget = function normalizeTarget(refPath: string): string {
    const target = withoutFragment(refPath);
    return stripLineSuffix(target.endsWith(TRAILING_SLASH) ? target.slice(0, -1) : target);
};
