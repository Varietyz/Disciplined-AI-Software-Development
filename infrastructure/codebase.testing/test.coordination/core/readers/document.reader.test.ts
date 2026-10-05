import { describe, it } from "vitest";
import { readDocument, unfencedLines } from "coordination-surface/tools/core/readers/document.reader.ts";
import assert from "node:assert/strict";

const SOURCE = [
    "---",
    "name: sample",
    "---",
    "# Title",
    "",
    "- item with `code.ts`",
    "1. ordered",
    "| a | b |",
    "owner: tools/a",
    "```ts",
    "see: `inside.ts`",
    "```",
    "plain [link](docs/a.md)",
    "---",
].join("\n");

describe("unfencedLines", () => {
    it("drops fence lines and everything between them, keeping line numbers", () => {
        assert.deepEqual(unfencedLines("a\n```\nb\n```\nc"), [
            { number: 1, text: "a" },
            { number: 5, text: "c" },
        ]);
    });
});

describe("readDocument", () => {
    it("classifies every line and reads fields, headings and inlines outside fences", () => {
        const document = readDocument("doc.md", SOURCE);
        assert.deepEqual(
            document.segments.map((segment) => segment.kind),
            [
                "frontmatter-open",
                "frontmatter-field",
                "frontmatter-close",
                "heading",
                "blank",
                "list-item",
                "list-item",
                "table-row",
                "field",
                "fence-open",
                "fence-body",
                "fence-close",
                "text",
                "text",
            ],
        );
        assert.deepEqual(
            document.segments.flatMap((segment) => segment.inlines.map((inline) => inline.value)),
            ["code.ts", "docs/a.md"],
        );
        assert.deepEqual(
            document.segments
                .filter((segment) => segment.key !== undefined)
                .map((segment) => [segment.key, segment.value ?? ""]),
            [
                ["name", "sample"],
                ["Title", ""],
                ["owner", "tools/a"],
            ],
        );
    });

    it("keeps each segment's offsets on the source", () => {
        assert.deepEqual(
            readDocument("doc.md", "ab  \ncd").segments.map((segment) => [segment.start, segment.end]),
            [
                [0, 2],
                [5, 7],
            ],
        );
    });
});
