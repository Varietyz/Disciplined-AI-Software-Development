import {
    REF_COLLECTIONS,
    bareReasonId,
    collectionRefResolver,
    kindRefResolves,
    kindsHolding,
    resolveTarget,
} from "@govlab/context/core/resolvers/reference.resolver.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const SHARED_ID = "invariant";

const KIND_MEMBERS = new Map([
    ["lens", new Set(["cause", SHARED_ID])],
    ["substrate-node", new Set([SHARED_ID])],
]);

const faces = {
    algo: { get: (id: string) => (id === "real-contract" ? { id } : null) },
    reason: { axes: () => [], kindMembers: () => KIND_MEMBERS, models: () => [], resolve: () => null },
};

test("collectionRefResolver resolves collection refs, kind-qualified reason refs, and a bare id only one kind holds", () => {
    const resolve = collectionRefResolver(faces);
    assert.equal(resolve("algorithms:real-contract"), true);
    assert.equal(resolve("algorithms:ghost"), false);
    assert.equal(resolve("reasoning:lens:cause"), true);
    assert.equal(resolve("reasoning:mode:cause"), false);
    assert.equal(resolve("reasoning:cause"), true);
    assert.equal(resolve(`reasoning:${SHARED_ID}`), false);
});

test("resolveTarget needs a collection prefix it knows", () => {
    assert.equal(resolveTarget(faces, "algorithms:real-contract"), true);
    assert.equal(resolveTarget(faces, "real-contract"), false);
    assert.equal(resolveTarget(faces, "elsewhere:real-contract"), false);
    assert.ok(REF_COLLECTIONS.has("algorithms"));
    assert.ok(REF_COLLECTIONS.has("reasoning"));
});

test("kindRefResolves, kindsHolding and bareReasonId read a reasoning ref", () => {
    assert.equal(kindRefResolves(KIND_MEMBERS, "reasoning:lens:cause"), true);
    assert.equal(kindRefResolves(KIND_MEMBERS, "reasoning:cause"), false);
    assert.deepEqual(kindsHolding(KIND_MEMBERS, SHARED_ID), ["lens", "substrate-node"]);
    assert.equal(bareReasonId("reasoning:lens:cause"), "lens:cause");
    assert.equal(bareReasonId("algorithms:x"), "algorithms:x");
});
