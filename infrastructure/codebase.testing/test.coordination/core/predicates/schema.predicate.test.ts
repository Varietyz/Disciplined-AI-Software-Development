import { describe, it } from "vitest";
import {
    hasFields,
    isCorpusMoveList,
    isObject,
    isStringMap,
} from "coordination-surface/tools/core/predicates/schema.predicate.ts";
import assert from "node:assert/strict";

describe("isObject and isStringMap", () => {
    it("accepts a plain object and refuses null and arrays; a string map holds only strings", () => {
        assert.equal(isObject({}), true);
        assert.equal(isObject(null), false);
        assert.equal(isObject([]), false);
        assert.equal(isStringMap({ a: "x" }), true);
        assert.equal(isStringMap({ a: 1 }), false);
    });
});

describe("hasFields", () => {
    it("requires every named field to be present", () => {
        assert.equal(hasFields({ a: 1, b: 2 }, ["a", "b"]), true);
        assert.equal(hasFields({ a: 1 }, ["a", "b"]), false);
    });
});

describe("isCorpusMoveList", () => {
    it("accepts moves carrying their string fields and refuses anything else", () => {
        const move = { facet: "f", from: "a", key: "k", to: "b", variant: null };
        assert.equal(isCorpusMoveList([move]), true);
        assert.equal(isCorpusMoveList([{ ...move, from: 1 }]), false);
        assert.equal(isCorpusMoveList(move), false);
    });
});
