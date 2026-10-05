import {
    commentsOf,
    hashComments,
    isAttribution,
    stripComments,
    typescriptComments,
} from "coordination-surface/tools/core/normalizers/source.normalizer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const SOURCE = [
    "// SPDX-License-Identifier: MIT",
    'const a = "// not a comment"; // trailing',
    "  /* block */",
    "const b = 1;",
].join("\n");

describe("typescriptComments and hashComments", () => {
    it("reads line and block comments outside strings", () => {
        assert.deepEqual(
            typescriptComments(SOURCE).map((span) => span.text),
            ["// SPDX-License-Identifier: MIT", "// trailing", "/* block */"],
        );
        assert.deepEqual(
            typescriptComments("/* unclosed").map((span) => span.end),
            [11],
        );
    });

    it("reads hash comments outside quotes", () => {
        assert.deepEqual(
            hashComments('key = "#1" # note\n# whole').map((span) => span.text),
            ["# note", "# whole"],
        );
    });
});

describe("stripComments", () => {
    it("removes each comment, keeping attributions and dropping a comment's own line", () => {
        const result = stripComments(SOURCE, typescriptComments(SOURCE));
        assert.deepEqual(result, {
            kept: 1,
            removed: 2,
            text: ["// SPDX-License-Identifier: MIT", 'const a = "// not a comment";', "const b = 1;"].join("\n"),
        });
    });

    it("keeps a shebang", () => {
        const source = "#!/usr/bin/env node\nx";
        assert.equal(stripComments(source, [{ end: 19, start: 0, text: "#!/usr/bin/env node" }]).text, source);
    });
});

describe("commentsOf and isAttribution", () => {
    it("chooses the comment grammar by extension and knows an attribution", () => {
        assert.equal(commentsOf("a.toml", "# x").length, 1);
        assert.equal(commentsOf("a.jsonc", "// x").length, 1);
        assert.deepEqual(commentsOf("a.md", "// x"), []);
        assert.equal(isAttribution("Copyright 2026"), true);
    });
});
