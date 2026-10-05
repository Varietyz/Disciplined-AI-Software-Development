import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { stringLiterals } from "coordination-surface/tools/core/predicates/literal.predicate.ts";

describe("stringLiterals", () => {
    it("reads each quoted literal with the line it opens on, across multi-line templates", () => {
        const source = ['const a = "one";', "const b = `two", "lines`;", "const c = 'three';"].join("\n");
        assert.deepEqual(stringLiterals(source), [
            { line: 1, value: "one" },
            { line: 2, value: "two\nlines" },
            { line: 4, value: "three" },
        ]);
    });

    it("reads an empty literal as an empty value", () => {
        assert.deepEqual(stringLiterals('x = ""'), [{ line: 1, value: "" }]);
    });
});
