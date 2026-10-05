import { isAlpha, isIdentifierChar, isWhitespace } from "@govlab/constants";

export const FUNC = "func";

const UNDERSCORE = "_";
const LINE_BREAK = "\n";

export const isIdentStart = function isIdentStart(char?: string): boolean {
    return typeof char === "string" && (isAlpha(char) || char === UNDERSCORE);
};

export const isIdentPart = function isIdentPart(char?: string): boolean {
    return typeof char === "string" && isIdentifierChar(char);
};

export const isSpace = function isSpace(char?: string): boolean {
    return typeof char === "string" && isWhitespace(char);
};

export const skipSpaces = function skipSpaces(src: string, from: number, bound: number): number {
    let at = from;
    while (at < bound && isSpace(src[at])) {
        at += 1;
    }
    return at;
};

export const skipIdent = function skipIdent(src: string, from: number, bound: number): number {
    let at = from;
    while (at < bound && isIdentPart(src[at])) {
        at += 1;
    }
    return at;
};

export const skipSpacesBack = function skipSpacesBack(src: string, from: number, start: number): number {
    let at = from;
    while (at >= start && isSpace(src[at])) {
        at -= 1;
    }
    return at;
};

export const skipIdentBack = function skipIdentBack(src: string, from: number, start: number): number {
    let at = from;
    while (at >= start && isIdentPart(src[at])) {
        at -= 1;
    }
    return at;
};

export const lastIdent = function lastIdent(text: string): string | null {
    let last: string | null = null;
    let current = "";
    for (const char of text) {
        if (isIdentPart(char)) {
            current += char;
            continue;
        }
        if (current !== "") {
            last = current;
        }
        current = "";
    }
    return current === "" ? last : current;
};

const depthDelta = function depthDelta(char: string | undefined, open: string, close: string): number {
    if (char === open) {
        return 1;
    }
    return char === close ? -1 : 0;
};

export const skipBalanced = function skipBalanced(src: string, from: number, pair: string): number {
    const open = pair.charAt(0);
    const close = pair.charAt(1);
    let depth = 1;
    let at = from + 1;
    while (at < src.length && depth > 0) {
        depth += depthDelta(src[at], open, close);
        at += 1;
    }
    return at;
};

export const lineAt = function lineAt(src: string, position: number): number {
    let line = 1;
    for (let at = 0; at < position && at < src.length; at += 1) {
        if (src[at] === LINE_BREAK) {
            line += 1;
        }
    }
    return line;
};
