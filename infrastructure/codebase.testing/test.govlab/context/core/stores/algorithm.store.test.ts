import { AlgorithmStore } from "@govlab/context/core/stores/algorithm.store.ts";
import type { ContractRecord } from "@govlab/context/types/algorithm.types.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const record = (id: string, composes: string[] = []): ContractRecord => ({
    composes,
    flow: [],
    force: ["speed"],
    id,
    intent: "i",
    invariant: "v",
    productions: [],
    title: id,
});

const warnings: string[] = [];

const store = new AlgorithmStore({
    data: [{ category: "planted", records: [record("hub", ["leaf", "ghost"]), record("leaf")], tier: "leaf" }],
    logger: {
        warn: (message) => {
            warnings.push(message);
        },
    },
    symbols: [],
});

test("the algorithm store resolves a closure along composes and warns on an unknown seed", () => {
    const closure = store.resolveClosure(["hub", "missing"]);
    assert.deepEqual(closure.order, ["hub", "leaf"]);
    assert.deepEqual(closure.seed, ["hub"]);
    assert.ok(warnings.some((warning) => warning.includes('"missing"')));
});

test("the algorithm store filters by force, clusters, joins concerns and reports a dangling compose", () => {
    assert.equal(store.byForce("speed").length, 2);
    assert.equal(store.cluster().length, 1);
    assert.equal(store.joinConcerns()[0]?.force, "speed");
    assert.deepEqual(store.symbols(), []);
    assert.deepEqual(store.validateOntology().danglingComposes, [{ from: "hub", target: "ghost" }]);
});
