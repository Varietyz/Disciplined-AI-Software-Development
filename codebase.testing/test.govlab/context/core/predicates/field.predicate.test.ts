import { isKebabId, lacksEntry, lacksValue } from "@govlab/context/core/predicates/field.predicate.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("lacksValue holds for a blank, a bare none, or none with no reason", () => {
    for (const blank of ["", "  ", "none", "none:", "none:   "]) {
        assert.equal(lacksValue(blank), true, blank);
    }
    for (const value of ["cyclomatic complexity", "none: an anti-pattern is refused, not enforced"]) {
        assert.equal(lacksValue(value), false, value);
    }
});

test("lacksEntry holds for a blank string or an empty list, and for nothing else", () => {
    assert.equal(lacksEntry(" "), true);
    assert.equal(lacksEntry([]), true);
    assert.equal(lacksEntry(["a"]), false);
    assert.equal(lacksEntry("held"), false);
    assert.equal(lacksEntry(3), false);
});

test("isKebabId accepts lowercase words joined by hyphens and nothing else", () => {
    for (const id of ["a", "cause", "category-theory", "x2"]) {
        assert.equal(isKebabId(id), true, id);
    }
    for (const id of ["", "Cause", "snake_case", "-lead", "trail-", "double--hyphen", "has space"]) {
        assert.equal(isKebabId(id), false, id);
    }
});
