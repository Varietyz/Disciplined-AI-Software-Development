import type { Inline, Segment } from "coordination-surface/tools/core/types/segment.types.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { referencesIn } from "coordination-surface/tools/core/matchers/reference.matcher.ts";

const inline = function inline(value: string): Inline {
    return { end: 0, kind: "inline-code", line: 3, start: 0, value };
};

const segment = function segment(fields: Partial<Segment>): Segment {
    return { end: 0, inlines: [], kind: "text", line: 3, start: 0, text: "", ...fields };
};

describe("referencesIn", () => {
    it("reads a path from a reference field, dropping its scheme, anchor and line locator", () => {
        const field = segment({ key: "see", kind: "field", value: "local:tools/core/a.ts#part:12 and more" });
        assert.deepEqual(referencesIn(field), [
            { line: 3, locus: "see:", raw: "local:tools/core/a.ts#part:12 and more", target: "tools/core/a.ts" },
        ]);
    });

    it("reads inline paths and skips external links, bare names, folders and patterns", () => {
        const text = segment({
            inlines: [
                "`tools/b.md`",
                "https://example.com/a.md",
                "a.md",
                "kit/core",
                "tools/<name>.md",
                "@scope/pkg/c.ts",
            ].map(inline),
        });
        assert.deepEqual(
            referencesIn(text).map((reference) => reference.target),
            ["tools/b.md", "scope/pkg/c.ts"],
        );
    });

    it("ignores fields that carry no reference", () => {
        assert.deepEqual(referencesIn(segment({ key: "owner", kind: "field", value: "tools/a.ts" })), []);
    });
});
