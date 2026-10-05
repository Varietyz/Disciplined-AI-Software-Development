import { answered, isDeclaredAbsent } from "@govlab/context/core/predicates/check.predicate.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const WATCHED = "a planted violation";

test("evidence counts as answered only with a known sign, and every other question needs a value", () => {
    assert.equal(answered({ evidence: `contradicted: ${WATCHED}` }, "evidence"), true);
    assert.equal(answered({ evidence: `probably: ${WATCHED}` }, "evidence"), false);
    assert.equal(answered({ authority: "none: the check reads one side only" }, "authority"), true);
    assert.equal(answered({ authority: "none" }, "authority"), false);
    assert.equal(answered(null, "population"), false);
});

test("isDeclaredAbsent holds for an answer that opens with none and a separator", () => {
    assert.equal(isDeclaredAbsent({ observation: "none: decided on source" }, "observation"), true);
    assert.equal(isDeclaredAbsent({ observation: "every run" }, "observation"), false);
    assert.equal(isDeclaredAbsent(null, "observation"), false);
});
