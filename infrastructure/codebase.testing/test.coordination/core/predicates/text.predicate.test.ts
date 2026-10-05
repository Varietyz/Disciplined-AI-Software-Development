import {
    contains,
    hasPrefix,
    leadingInteger,
    splitWords,
} from "coordination-surface/tools/core/predicates/text.predicate.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("leadingInteger", () => {
    it("reads the digits a text opens with, after any spaces, and reads no digits as not a number", () => {
        assert.equal(leadingInteger("  42: the line"), 42);
        assert.equal(leadingInteger("7"), 7);
        assert.ok(Number.isNaN(leadingInteger("line 7")));
        assert.ok(Number.isNaN(leadingInteger("")));
    });
});

describe("contains and hasPrefix", () => {
    it("answers substring and prefix questions, treating the empty needle as present", () => {
        assert.equal(contains("board.rule.ts", "rule"), true);
        assert.equal(contains("a", ""), true);
        assert.equal(contains("a", "ab"), false);
        assert.equal(hasPrefix("kit/core", "kit"), true);
        assert.equal(hasPrefix("ki", "kit"), false);
    });
});

describe("splitWords", () => {
    it("splits a command on blanks, keeping quoted runs whole without their quotes", () => {
        assert.deepEqual(splitWords(`node  tools/run.ts --name "two words"\t'x'`), [
            "node",
            "tools/run.ts",
            "--name",
            "two words",
            "x",
        ]);
        assert.deepEqual(splitWords(""), []);
    });
});
