import type { Document, Segment, SegmentKind } from "../types/segment.types.ts";
import type { SourceLine } from "../types/document.types.ts";
import { inlinesOf } from "./token.reader.ts";

interface ReadState {
    readonly fenced: boolean;
    readonly frontmatter: boolean;
    readonly closed: boolean;
}

interface Shape {
    readonly kind: SegmentKind;
    readonly extra: Partial<Segment>;
}

interface Classified extends Shape {
    readonly next: ReadState;
}

const FENCE = "```";

const FRONTMATTER = "---";

const FIELD_BREAKS = [" ", "\t", "`", "|"];

const INITIAL: ReadState = { closed: false, fenced: false, frontmatter: false };

export const unfencedLines = function unfencedLines(source: string): SourceLine[] {
    const out: SourceLine[] = [];
    let fenced = false;

    for (const [index, text] of source.split("\n").entries()) {
        const fence = text.startsWith(FENCE);
        if (!fence && !fenced) {
            out.push({ number: index + 1, text });
        }
        fenced = fence ? !fenced : fenced;
    }

    return out;
};

const isIndent = function isIndent(char: string): boolean {
    return char === " " || char === "\t";
};

const isDigit = function isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
};

const indentOf = function indentOf(line: string): number {
    let cursor = 0;
    while (cursor < line.length && isIndent(line.charAt(cursor))) {
        cursor += 1;
    }
    return cursor;
};

const isBlank = function isBlank(line: string): boolean {
    return indentOf(line) === line.length;
};

const headingDepth = function headingDepth(line: string): number {
    let depth = 0;
    while (line.charAt(depth) === "#") {
        depth += 1;
    }
    return depth;
};

const isBullet = function isBullet(line: string, at: number): boolean {
    const char = line.charAt(at);
    return (char === "-" || char === "*") && line.charAt(at + 1) === " ";
};

const isOrdinal = function isOrdinal(line: string, at: number): boolean {
    let cursor = at;
    while (isDigit(line.charAt(cursor))) {
        cursor += 1;
    }
    return cursor !== at && line.startsWith(". ", cursor);
};

const isListMarker = function isListMarker(line: string, at: number): boolean {
    return isBullet(line, at) || isOrdinal(line, at);
};

const fieldAt = function fieldAt(line: string, from: number): { key: string; value: string } | null {
    const colon = line.indexOf(":", from);
    const key = colon <= from ? "" : line.slice(from, colon);
    if (key.length === 0 || FIELD_BREAKS.some((mark) => key.includes(mark))) {
        return null;
    }

    let cursor = colon + 1;
    while (line.charAt(cursor) === " ") {
        cursor += 1;
    }

    return { key, value: line.slice(cursor).trimEnd() };
};

const fieldShape = function fieldShape(line: string, kind: "field" | "frontmatter-field"): Shape {
    const field = fieldAt(line, indentOf(line));
    return field === null ? { extra: {}, kind: "text" } : { extra: { key: field.key, value: field.value }, kind };
};

const fenceStep = function fenceStep(state: ReadState, line: string): Classified | null {
    if (line.startsWith(FENCE)) {
        return {
            extra: {},
            kind: state.fenced ? "fence-close" : "fence-open",
            next: { ...state, fenced: !state.fenced },
        };
    }
    return state.fenced ? { extra: {}, kind: "fence-body", next: state } : null;
};

const frontmatterStep = function frontmatterStep(state: ReadState, line: string, index: number): Classified | null {
    if (line.trimEnd() !== FRONTMATTER || state.closed) {
        return null;
    }
    if (!state.frontmatter && index === 0) {
        return { extra: {}, kind: "frontmatter-open", next: { ...state, frontmatter: true } };
    }
    return state.frontmatter
        ? { extra: {}, kind: "frontmatter-close", next: { ...state, closed: true, frontmatter: false } }
        : null;
};

const bodyShape = function bodyShape(state: ReadState, line: string): Shape {
    if (isBlank(line)) {
        return { extra: {}, kind: "blank" };
    }
    if (state.frontmatter) {
        return fieldShape(line, "frontmatter-field");
    }

    const depth = headingDepth(line);
    if (depth > 0 && line.charAt(depth) === " ") {
        return { extra: { depth, key: line.slice(depth).trim() }, kind: "heading" };
    }

    const indent = indentOf(line);
    if (line.charAt(indent) === "|") {
        return { extra: {}, kind: "table-row" };
    }
    return isListMarker(line, indent) ? { extra: {}, kind: "list-item" } : fieldShape(line, "field");
};

const classify = function classify(state: ReadState, line: string, index: number): Classified {
    return fenceStep(state, line) ?? frontmatterStep(state, line, index) ?? { ...bodyShape(state, line), next: state };
};

export const readDocument = function readDocument(path: string, source: string): Document {
    const segments: Segment[] = [];
    let state = INITIAL;
    let offset = 0;

    for (const [index, line] of source.split("\n").entries()) {
        const step = classify(state, line, index);
        const number = index + 1;
        const inlines = state.fenced ? [] : inlinesOf(line, offset, number);

        segments.push({
            end: offset + line.trimEnd().length,
            inlines,
            kind: step.kind,
            line: number,
            start: offset,
            text: line,
            ...step.extra,
        });

        state = step.next;
        offset += line.length + 1;
    }

    return { path, segments, source };
};
