import type { Document, Segment, SegmentPattern } from "coordination-surface/tools/core/types/segment.types.ts";
import { describe, it } from "vitest";
import { matchAll, matchPattern } from "coordination-surface/tools/core/matchers/segment.matcher.ts";
import assert from "node:assert/strict";

const segment = function segment(line: number, fields: Partial<Segment>): Segment {
    return { end: line * 10 + 9, inlines: [], kind: "text", line, start: line * 10, text: "", ...fields };
};

const DOCUMENT: Document = {
    path: "doc.md",
    segments: [
        segment(1, { depth: 1, kind: "heading", text: "# Owners" }),
        segment(2, { key: "owner", kind: "field", text: "owner: tools/a", value: "tools/a" }),
        segment(3, {
            inlines: [{ end: 0, kind: "inline-code", line: 3, start: 0, value: "board.rule.ts" }],
            text: "see `board.rule.ts`",
        }),
        segment(4, { depth: 1, kind: "heading", text: "# Notes" }),
    ],
    source: "",
};

const HEADED_FIELD: SegmentPattern = {
    id: "headed-field",
    predicates: [
        { depthEquals: 1, kind: "heading" },
        { keyEquals: "owner", valueStartsWith: "tools/" },
    ],
};

const CITED_RULE: SegmentPattern = {
    id: "cited-rule",
    predicates: [{ inlineKind: "inline-code", inlineValueContains: ".rule." }],
};

describe("matchPattern", () => {
    it("reports each run of consecutive segments that satisfies the predicates in order, with its span", () => {
        assert.deepEqual(
            matchPattern(DOCUMENT, HEADED_FIELD).map((hit) => [hit.index, hit.span]),
            [[0, { end: 29, line: 1, start: 10 }]],
        );
    });

    it("finds no hit for an empty pattern or a pattern longer than the document", () => {
        assert.deepEqual(matchPattern(DOCUMENT, { id: "empty", predicates: [] }), []);
        const long = { id: "long", predicates: Array.from({ length: 5 }, () => ({})) };
        assert.deepEqual(matchPattern(DOCUMENT, long), []);
    });

    it("matches a segment by the kind and value of an inline it carries, and by text", () => {
        assert.deepEqual(
            matchPattern(DOCUMENT, CITED_RULE).map((hit) => hit.index),
            [2],
        );
        assert.deepEqual(
            matchPattern(DOCUMENT, { id: "notes", predicates: [{ textContains: "Notes" }] }).map((hit) => hit.index),
            [3],
        );
    });
});

describe("matchAll", () => {
    it("collects the hits of every pattern in pattern order", () => {
        assert.deepEqual(
            matchAll(DOCUMENT, [CITED_RULE, HEADED_FIELD]).map((hit) => hit.patternId),
            ["cited-rule", "headed-field"],
        );
    });
});
