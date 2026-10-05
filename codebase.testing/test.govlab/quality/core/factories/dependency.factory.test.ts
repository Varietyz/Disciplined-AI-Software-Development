import assert from "node:assert/strict";
import { computePlan } from "@govlab/quality/core/factories/dependency.factory.ts";
import { test } from "vitest";

test("computePlan returns empty groups for no ecosystems", () => {
    const plan = computePlan([]);
    assert.deepEqual(plan.ecosystems, []);
    assert.deepEqual(plan.npmDeps, []);
    assert.deepEqual(plan.emitters, []);
});

test("computePlan lists sorted, unique npm packages and no disabled emitter", () => {
    const plan = computePlan(["typescript"]);
    assert.deepEqual(
        plan.npmDeps,
        [...new Set(plan.npmDeps)].sort((a, b) => a.localeCompare(b)),
    );
    assert.equal(plan.emitters.includes("none"), false);
});
