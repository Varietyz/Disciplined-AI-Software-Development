import type { PathSpan, TokenSpan } from "#types/markdown.types";

const PATH_EXTENSIONS: ReadonlySet<string> = new Set(
    "ts tsx mts cts js jsx mjs cjs json jsonc md css scss go sh html yml yaml toml py rs java rb php sql".split(" "),
);
const EDGE_PUNCT: ReadonlySet<string> = new Set(["(", ")", "[", "]", ",", ";", ":", '"', "'", "!", "?", "`"]);
const INLINE_SPACE: ReadonlySet<string> = new Set([" ", "\t"]);
const RELATIVE_PREFIXES: readonly string[] = ["./", "../"];
const SCHEME_MARKER = "://";
const PACKAGE_MARK = "@";
const SEPARATOR = "/";
const DOT = ".";
const DOUBLE_DOT = "..";

const isTrailingEdge = function isTrailingEdge(token: string, end: number): boolean {
    const char = token.charAt(end - 1);
    return EDGE_PUNCT.has(char) || (char === DOT && token.charAt(end - DOUBLE_DOT.length) !== DOT);
};

export const trimEdges = function trimEdges(token: string): string {
    let start = 0;
    let end = token.length;
    while (start < end && EDGE_PUNCT.has(token.charAt(start))) {
        start += 1;
    }
    while (end > start && isTrailingEdge(token, end)) {
        end -= 1;
    }
    return token.slice(start, end);
};

const extensionOf = function extensionOf(token: string): string {
    const dot = token.lastIndexOf(DOT);
    return dot === -1 ? "" : token.slice(dot + 1).toLowerCase();
};

export const isProsePath = function isProsePath(token: string): boolean {
    if (!token.includes(SEPARATOR) || token.includes(SCHEME_MARKER) || token.startsWith(PACKAGE_MARK)) {
        return false;
    }
    if (RELATIVE_PREFIXES.some((prefix) => token.startsWith(prefix))) {
        return true;
    }
    return PATH_EXTENSIONS.has(extensionOf(token));
};

export const nextToken = function nextToken(prose: string, from: number): TokenSpan {
    let at = from;
    while (at < prose.length && INLINE_SPACE.has(prose.charAt(at))) {
        at += 1;
    }
    const start = at;
    while (at < prose.length && !INLINE_SPACE.has(prose.charAt(at))) {
        at += 1;
    }
    return { next: at, start };
};

const pathSpanAt = function pathSpanAt(prose: string, from: number): PathSpan {
    const token = nextToken(prose, from);
    const raw = prose.slice(token.start, token.next);
    const trimmed = trimEdges(raw);
    if (!isProsePath(trimmed)) {
        return { next: token.next, span: null };
    }
    const start = token.start + raw.indexOf(trimmed);
    return { next: token.next, span: [start, start + trimmed.length] };
};

export const pathSpans = function pathSpans(prose: string): [number, number][] {
    const spans: [number, number][] = [];
    let at = 0;
    while (at < prose.length) {
        const found = pathSpanAt(prose, at);
        if (found.span !== null) {
            spans.push(found.span);
        }
        at = found.next;
    }
    return spans;
};
