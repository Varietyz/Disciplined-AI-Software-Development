import { isObject, isPlainRecord, isStringList } from "@govlab/context/core/predicates/record.predicate.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("isObject admits any non-null object, and isPlainRecord refuses a list", () => {
    assert.equal(isObject({}), true);
    assert.equal(isObject([]), true);
    assert.equal(isObject(null), false);
    assert.equal(isPlainRecord({}), true);
    assert.equal(isPlainRecord([]), false);
});

test("isStringList admits only a list of strings", () => {
    assert.equal(isStringList(["a", "b"]), true);
    assert.equal(isStringList([]), true);
    assert.equal(isStringList(["a", 1]), false);
    assert.equal(isStringList("a"), false);
});
