import { COMMENT_PUNCTUATION, LICENSE_MARKERS } from "#configuration/constants/comment.constants";
import type { CommentGrammar, CommentSpan, ExtractResult, StripResult } from "#types/comment.types";
import { commentNodes, parseCodeSync } from "@govlab/code-parse";

const lineStartOf = function lineStartOf(text: string, pos: number): number {
    return text.lastIndexOf("\n", pos - 1) + 1;
};

const trimLeadingWs = function trimLeadingWs(text: string, pos: number): number {
    let i = pos;
    while (i > 0 && (text[i - 1] === " " || text[i - 1] === "\t")) {
        i -= 1;
    }
    return i;
};

const removalBounds = function removalBounds(text: string, span: CommentSpan): { start: number; end: number } {
    if (span.ownLine) {
        const end = span.end < text.length && text[span.end] === "\n" ? span.end + 1 : span.end;
        return { end, start: lineStartOf(text, span.start) };
    }
    return { end: span.end, start: trimLeadingWs(text, span.start) };
};

const stripBounds = function stripBounds(text: string, removable: CommentSpan[]): string {
    let out = "";
    let prev = 0;
    for (const span of removable) {
        const bounds = removalBounds(text, span);
        if (bounds.start >= prev) {
            out += text.slice(prev, bounds.start);
            prev = bounds.end;
        }
    }
    return out + text.slice(prev);
};

const removeSpans = function removeSpans(text: string, spans: CommentSpan[]): StripResult {
    const removable = spans.filter((span) => !span.directive);
    return removable.length === 0
        ? { changed: false, content: text }
        : { changed: true, content: stripBounds(text, removable) };
};

const stripCommentPunctuation = function stripCommentPunctuation(text: string): string {
    let i = 0;
    while (i < text.length && COMMENT_PUNCTUATION.has(text[i] ?? "")) {
        i += 1;
    }
    return text.slice(i);
};

const isLicenseComment = function isLicenseComment(commentText: string): boolean {
    const inner = stripCommentPunctuation(commentText);
    return LICENSE_MARKERS.some((marker) => inner.startsWith(marker));
};

const isDirectiveComment = function isDirectiveComment(commentText: string, prefixes: readonly string[]): boolean {
    return prefixes.some((prefix) => commentText.startsWith(prefix)) || isLicenseComment(commentText);
};

const isOwnLine = function isOwnLine(text: string, start: number): boolean {
    return text.slice(lineStartOf(text, start), start).trim() === "";
};

const commentSpans = function commentSpans(content: string, grammar: CommentGrammar): CommentSpan[] {
    const root = parseCodeSync(content, grammar.lang);
    if (root === null) {
        return [];
    }
    const spans = commentNodes(root).map((node): CommentSpan => {
        const start = node.startIndex ?? 0;
        return {
            directive: isDirectiveComment(node.text ?? "", grammar.directivePrefixes),
            end: node.endIndex ?? start,
            ownLine: isOwnLine(content, start),
            start,
        };
    });
    return spans.toSorted((a, b) => a.start - b.start);
};

const lineNumber = function lineNumber(text: string, pos: number): number {
    return text.slice(0, Math.min(pos, text.length)).split("\n").length;
};

export const extractComments = function extractComments(content: string, grammar: CommentGrammar): ExtractResult {
    const spans = commentSpans(content, grammar);
    const comments = spans
        .filter((span) => !span.directive)
        .map((span) => ({ line: lineNumber(content, span.start), text: content.slice(span.start, span.end) }));
    const stripped = removeSpans(content, spans);
    return { changed: stripped.changed, comments, content: stripped.content };
};

export const stripComments = function stripComments(content: string, grammar: CommentGrammar): StripResult {
    return removeSpans(content, commentSpans(content, grammar));
};
