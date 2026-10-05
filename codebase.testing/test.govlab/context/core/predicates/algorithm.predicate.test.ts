import assert from "node:assert/strict";
import { buildSymbolIndex } from "@govlab/context";
import { symbolIndexesMatch } from "@govlab/context/core/predicates/algorithm.predicate.ts";
import { test } from "vitest";

test("symbolIndexesMatch holds for two indexes built from the same input", () => {
    const contracts = [
        { domain: "g", id: "r1", productions: [{ lhs: "A", rhs: "<x>" }] },
        { domain: "g", id: "r2", productions: [{ lhs: "B", rhs: '"y" | "z"' }] },
    ];
    assert.equal(symbolIndexesMatch(buildSymbolIndex(contracts), buildSymbolIndex(contracts)), true);
});

test("symbolIndexesMatch fails on a changed copy of the index", () => {
    const index = buildSymbolIndex([{ domain: "g", id: "r1", productions: [{ lhs: "A", rhs: "<x>" }] }]);
    const changed = index.map((entry, position) => (position === 0 ? { ...entry, name: "Changed" } : entry));
    assert.equal(symbolIndexesMatch(index, changed), false);
});

test("symbolIndexesMatch treats two empty indexes as equal", () => {
    assert.equal(symbolIndexesMatch([], []), true);
});
