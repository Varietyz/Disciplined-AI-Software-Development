import { at, endOfQuoted, isAttribution } from "../predicates/comment.predicate.ts";
import type { CommentSpan } from "../types/comment.types.ts";
import type { StripResult } from "../types/source.types.ts";

export { isAttribution } from "../predicates/comment.predicate.ts";

interface Taken {
    readonly end: number;
    readonly span: CommentSpan;
}

interface Scanned {
    readonly next: number;
    readonly span: CommentSpan | null;
}

type Take = (source: string, cursor: number) => Taken | null;

const BLOCK_CLOSE = "*/";

const scannedAt = function scannedAt(source: string, cursor: number, quotes: readonly string[], take: Take): Scanned {
    const char = at(source, cursor);
    if (quotes.includes(char)) {
        return { next: endOfQuoted(source, cursor + 1, char), span: null };
    }

    const taken = take(source, cursor);
    return taken === null
        ? { next: cursor + 1, span: null }
        : { next: Math.max(taken.end, cursor + 1), span: taken.span };
};

const scanComments = function scanComments(source: string, quotes: readonly string[], take: Take): CommentSpan[] {
    const spans: CommentSpan[] = [];
    let cursor = 0;

    while (cursor < source.length) {
        const scanned = scannedAt(source, cursor, quotes, take);
        if (scanned.span !== null) {
            spans.push(scanned.span);
        }
        cursor = scanned.next;
    }

    return spans;
};

const takenBetween = function takenBetween(source: string, start: number, end: number): Taken {
    return { end, span: { end, start, text: source.slice(start, end) } };
};

const lineSpan = function lineSpan(source: string, start: number): Taken {
    const newline = source.indexOf("\n", start);
    return takenBetween(source, start, newline === -1 ? source.length : newline);
};

const blockSpan = function blockSpan(source: string, start: number): Taken {
    const close = source.indexOf(BLOCK_CLOSE, start + 2);
    return takenBetween(source, start, close === -1 ? source.length : close + BLOCK_CLOSE.length);
};

export const typescriptComments = function typescriptComments(source: string): CommentSpan[] {
    return scanComments(source, ['"', "'", "`"], (text, cursor) => {
        if (at(text, cursor) !== "/") {
            return null;
        }

        const marker = at(text, cursor + 1);
        if (marker === "/") {
            return lineSpan(text, cursor);
        }
        return marker === "*" ? blockSpan(text, cursor) : null;
    });
};

const isBlank = function isBlank(char: string): boolean {
    return char === " " || char === "\t";
};

const isKept = function isKept(span: CommentSpan, shebang: boolean): boolean {
    return isAttribution(span.text) || (shebang && span.start === 0);
};

const indentStart = function indentStart(text: string, start: number): number {
    let from = start;
    while (from > 0 && isBlank(at(text, from - 1))) {
        from -= 1;
    }
    return from;
};

const withoutSpan = function withoutSpan(text: string, span: CommentSpan): string {
    const from = indentStart(text, span.start);
    const atLineStart = from === 0 || at(text, from - 1) === "\n";
    const to = atLineStart && at(text, span.end) === "\n" ? span.end + 1 : span.end;
    return text.slice(0, from) + text.slice(to);
};

export const stripComments = function stripComments(source: string, spans: readonly CommentSpan[]): StripResult {
    const shebang = source.startsWith("#!");
    const dropped = spans.filter((span) => !isKept(span, shebang));
    let text = source;

    for (const span of dropped.toReversed()) {
        text = withoutSpan(text, span);
    }

    return { kept: spans.length - dropped.length, removed: dropped.length, text };
};

export const hashComments = function hashComments(source: string): CommentSpan[] {
    return scanComments(source, ['"', "'"], (text, cursor) =>
        at(text, cursor) === "#" ? lineSpan(text, cursor) : null,
    );
};

export const commentsOf = function commentsOf(path: string, source: string): CommentSpan[] {
    if (path.endsWith(".ts")) {
        return typescriptComments(source);
    }
    if (path.endsWith(".toml")) {
        return hashComments(source);
    }
    return path.endsWith(".json") || path.endsWith(".jsonc") ? typescriptComments(source) : [];
};
