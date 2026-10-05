import assert from "node:assert/strict";
import { biasTokensIn } from "@govlab/quality/core/matchers/context.matcher.ts";
import { test } from "vitest";

test("biasTokensIn finds nothing in empty or punctuation-only text", () => {
    assert.deepEqual(biasTokensIn(""), []);
    assert.deepEqual(biasTokensIn("!!! ??? ..."), []);
});

test("biasTokensIn reports each stack token once, case-folded, and ignores ordinary words", () => {
    assert.deepEqual(biasTokensIn("Run NPM then npm, then Vitest"), ["npm", "vitest"]);
    assert.deepEqual(biasTokensIn("some ordinary sentence"), []);
});
