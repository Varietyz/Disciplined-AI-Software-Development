import { at, endOfQuoted, isAttribution } from "coordination-surface/tools/core/predicates/comment.predicate.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("at", () => {
    it("reads the character at an index, or nothing past the end", () => {
        assert.equal(at("abc", 1), "b");
        assert.equal(at("abc", 5), "");
    });
});

describe("isAttribution", () => {
    it("recognizes a license or copyright line and nothing else", () => {
        assert.equal(isAttribution("// SPDX-License-Identifier: MIT"), true);
        assert.equal(isAttribution("// Copyright 2026"), true);
        assert.equal(isAttribution("// reads the board"), false);
    });
});

describe("endOfQuoted", () => {
    it("returns the index after the closing quote, stepping over escaped quotes", () => {
        const source = String.raw`"a\"b" rest`;
        assert.equal(endOfQuoted(source, 1, '"'), 6);
        assert.equal(endOfQuoted('"open', 1, '"'), 5);
    });
});
