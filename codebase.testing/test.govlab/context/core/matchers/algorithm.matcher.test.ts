import type { Contract } from "@govlab/context";
import assert from "node:assert/strict";
import { matchesContract } from "@govlab/context/core/matchers/algorithm.matcher.ts";
import { test } from "vitest";

const CONTRACT: Contract = {
    composes: ["leaf"],
    domain: "pag",
    flow: [],
    force: ["speed"],
    id: "c1",
    intent: "",
    invariant: "",
    meta: true,
    productions: [],
    tier: "process",
    title: "t",
};

test("an empty filter matches every contract, and each set field narrows the match", () => {
    assert.equal(matchesContract(CONTRACT, {}), true);
    assert.equal(matchesContract(CONTRACT, { composes: "leaf", domain: "pag", force: "speed", meta: true }), true);
    assert.equal(matchesContract(CONTRACT, { domain: "other" }), false);
    assert.equal(matchesContract(CONTRACT, { force: "care" }), false);
    assert.equal(matchesContract(CONTRACT, { composes: "ghost" }), false);
    assert.equal(matchesContract(CONTRACT, { meta: false }), false);
    assert.equal(matchesContract(CONTRACT, { domain: "" }), true);
});
