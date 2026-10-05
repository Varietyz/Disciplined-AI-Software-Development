import {
    applyEdits,
    editsFromFieldPrefixes,
    editsFromFieldValues,
    editsFromInlinePrefixes,
    editsFromInlines,
} from "coordination-surface/tools/core/transformers/segment.transformer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { readDocument } from "coordination-surface/tools/core/readers/document.reader.ts";

type Edit = Parameters<typeof applyEdits>[1][number];

const edit = function edit(start: number, end: number, replacement: string): Edit {
    return { end, path: "doc.md", reason: "", replacement, start };
};

const SOURCE = "see: old.md\nsee: old.md#part\nuse `old.md` and [x](old.md#a)\n";
const MAP = { "old.md": "new.md" };
const DOCUMENT = readDocument("doc.md", SOURCE);

describe("the edit builders", () => {
    it("rename a field value and an inline that equal an old name, and the prefix of one that continues it", () => {
        const values = editsFromFieldValues(DOCUMENT, "see", MAP);
        const prefixes = editsFromFieldPrefixes(DOCUMENT, ["see"], MAP);
        const inlines = editsFromInlines(DOCUMENT, MAP, ["inline-code", "link-target"]);
        const inlinePrefixes = editsFromInlinePrefixes(DOCUMENT, MAP, ["link-target"]);
        assert.deepEqual(
            [values, prefixes, inlines, inlinePrefixes].map((edits) => edits.length),
            [1, 1, 1, 1],
        );
        const { rejected, text } = applyEdits(SOURCE, [...values, ...prefixes, ...inlines, ...inlinePrefixes]);
        assert.deepEqual(rejected, []);
        assert.equal(text, "see: new.md\nsee: new.md#part\nuse `new.md` and [x](new.md#a)\n");
    });
});

describe("applyEdits", () => {
    it("applies edits from the end backwards, and rejects an overlapping or malformed one", () => {
        const result = applyEdits("abcdef", [edit(0, 2, "X"), edit(1, 3, "Y"), edit(4, 9, "Z")]);
        assert.equal(result.text, "aYdef");
        assert.equal(result.applied.length, 1);
        assert.equal(result.rejected.length, 2);
    });
});
