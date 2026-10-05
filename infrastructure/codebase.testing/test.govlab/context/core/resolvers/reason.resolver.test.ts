import { buildIndexes, conceptResolver, resolveId } from "@govlab/context/core/resolvers/reason.resolver.ts";
import assert from "node:assert/strict";
import { bundledReason } from "../validators/ontology.fixture.ts";
import { test } from "vitest";

test("buildIndexes indexes every reason node by id", () => {
    const data = bundledReason();
    const [first] = data.nodes;
    assert.ok(first);
    assert.equal(buildIndexes(data).node.get(first.id)?.id, first.id);
});

test("resolveId resolves the derivation loop id to the loop record", () => {
    const data = bundledReason();
    assert.equal(resolveId(data, buildIndexes(data))(data.derivationLoop.id)?.kind, "loop");
});

test("conceptResolver is a callable node resolver", () => {
    const { concepts } = buildIndexes(bundledReason());
    assert.equal(typeof conceptResolver(concepts), "function");
});
