import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { inlinesOf } from "coordination-surface/tools/core/readers/token.reader.ts";

describe("inlinesOf", () => {
    it("reads code spans, link targets and scoped import paths with their offsets", () => {
        const line = "use `a.ts` and [b](docs/b.md) from @scope/pkg, not a@b/c or `` or `open";
        assert.deepEqual(inlinesOf(line, 100, 7), [
            { end: 109, kind: "inline-code", line: 7, start: 105, value: "a.ts" },
            { end: 128, kind: "link-target", line: 7, start: 119, value: "docs/b.md" },
            { end: 146, kind: "import-path", line: 7, start: 136, value: "scope/pkg," },
        ]);
    });
});
