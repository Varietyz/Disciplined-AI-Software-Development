import type { Document, Hit, Inline, Segment, SegmentPattern, SegmentPredicate } from "../types/segment.types.ts";
import { contains, hasPrefix } from "../predicates/text.predicate.ts";

const differs = function differs<T>(expected: T | undefined, actual: T | undefined): boolean {
    return expected !== undefined && actual !== expected;
};

const scalarsMatch = function scalarsMatch(segment: Segment, predicate: SegmentPredicate): boolean {
    return (
        !differs(predicate.kind, segment.kind) &&
        !differs(predicate.depthEquals, segment.depth) &&
        !differs(predicate.keyEquals, segment.key) &&
        !differs(predicate.valueEquals, segment.value)
    );
};

const prefixMatches = function prefixMatches(segment: Segment, predicate: SegmentPredicate): boolean {
    const prefix = predicate.valueStartsWith;
    return prefix === undefined || (segment.value !== undefined && hasPrefix(segment.value, prefix));
};

const textMatches = function textMatches(segment: Segment, predicate: SegmentPredicate): boolean {
    return predicate.textContains === undefined || contains(segment.text, predicate.textContains);
};

const inlineMatches = function inlineMatches(inline: Inline, predicate: SegmentPredicate): boolean {
    const needle = predicate.inlineValueContains;
    return !differs(predicate.inlineKind, inline.kind) && (needle === undefined || contains(inline.value, needle));
};

const inlinesMatch = function inlinesMatch(segment: Segment, predicate: SegmentPredicate): boolean {
    const unconstrained = predicate.inlineKind === undefined && predicate.inlineValueContains === undefined;
    return unconstrained || segment.inlines.some((inline) => inlineMatches(inline, predicate));
};

const matchesOne = function matchesOne(segment: Segment, predicate: SegmentPredicate): boolean {
    return (
        scalarsMatch(segment, predicate) &&
        prefixMatches(segment, predicate) &&
        textMatches(segment, predicate) &&
        inlinesMatch(segment, predicate)
    );
};

const matchesAt = function matchesAt(
    segments: readonly Segment[],
    predicates: readonly SegmentPredicate[],
    start: number,
): boolean {
    return predicates.every((predicate, offset) => {
        const segment = segments[start + offset];
        return segment !== undefined && matchesOne(segment, predicate);
    });
};

const hitAt = function hitAt(document: Document, pattern: SegmentPattern, index: number): Hit[] {
    const width = pattern.predicates.length;
    if (!matchesAt(document.segments, pattern.predicates, index)) {
        return [];
    }

    const span = document.segments.slice(index, index + width);
    const [first] = span;
    const final = span.at(-1);
    if (first === undefined || final === undefined) {
        return [];
    }

    return [
        {
            index,
            path: document.path,
            patternId: pattern.id,
            segments: span,
            span: { end: final.end, line: first.line, start: first.start },
        },
    ];
};

export const matchPattern = function matchPattern(document: Document, pattern: SegmentPattern): Hit[] {
    const width = pattern.predicates.length;
    if (width === 0) {
        return [];
    }

    const starts = Math.max(0, document.segments.length - width + 1);
    return [...document.segments.keys()].slice(0, starts).flatMap((index) => hitAt(document, pattern, index));
};

export const matchAll = function matchAll(document: Document, patterns: readonly SegmentPattern[]): Hit[] {
    return patterns.flatMap((pattern) => matchPattern(document, pattern));
};
