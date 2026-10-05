import {
    asLayerEdge,
    asLayerMembership,
    asTensionResolution,
} from "@govlab/context/core/normalizers/layer.normalizer.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("asLayerEdge keeps an edge with both ends and a declared kind, and refuses an undeclared kind", () => {
    assert.deepEqual(asLayerEdge({ from: "a", kind: "feeds", to: "b" }), { from: "a", kind: "feeds", to: "b" });
    assert.equal(asLayerEdge({ from: "a", kind: "feeds" }), null);
    assert.equal(asLayerEdge("loose"), null);
    assert.throws(() => asLayerEdge({ from: "a", kind: "ghost", to: "b" }));
});

test("asLayerMembership needs both a key and a layer", () => {
    assert.deepEqual(asLayerMembership({ key: "k", layer: "l" }), { key: "k", layer: "l" });
    assert.equal(asLayerMembership({ key: "k" }), null);
    assert.equal(asLayerMembership(3), null);
});

test("asTensionResolution needs both ends and a rule, and refuses an undeclared mechanism", () => {
    const seed = { a: "x", b: "y", mechanism: "mitigation", rule: "r", scopeA: "s", scopeB: "t" };
    assert.deepEqual(asTensionResolution(seed), seed);
    assert.equal(asTensionResolution({ ...seed, rule: "" }), null);
    assert.equal(asTensionResolution(null), null);
    assert.throws(() => asTensionResolution({ ...seed, mechanism: "ghost" }));
});
