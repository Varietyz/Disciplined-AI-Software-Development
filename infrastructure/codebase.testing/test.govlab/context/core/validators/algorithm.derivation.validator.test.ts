import {
    derivationMapDefectsOf,
    isKernelContract,
} from "@govlab/context/core/validators/algorithm.derivation.validator.ts";
import type { Contract } from "@govlab/context";
import assert from "node:assert/strict";
import { test } from "vitest";

const STAGES = new Map([
    ["verify", "evaluative"],
    ["constrain", "substrate"],
]);

const FACES = { algo: { get: (id: string) => (id === "r" ? { id } : null) } };

const kernel = (derivationMap: NonNullable<Contract["derivationMap"]>): Contract => ({
    composes: [],
    derivationMap,
    domain: "pag",
    flow: [],
    force: [],
    id: "k",
    intent: "",
    invariant: "",
    productions: [],
    tier: "process",
    title: "k",
});

test("a contract with a derivation map is a kernel, and one without is not", () => {
    assert.equal(isKernelContract(kernel([{ record: "r", stage: "verify" }])), true);
    assert.equal(isKernelContract(kernel([])), false);
});

test("derivationMapDefectsOf reports the first defect of each map and passes a map covering verify", () => {
    assert.deepEqual(derivationMapDefectsOf([kernel([{ record: "r", stage: "verify" }])], STAGES, FACES), []);
    const defects = derivationMapDefectsOf([kernel([{ record: "r", stage: "constrain" }])], STAGES, FACES);
    assert.deepEqual(defects, [{ id: "k", reason: "derivationMap omits mandatory-always stage(s): verify" }]);
    assert.deepEqual(derivationMapDefectsOf([kernel([])], STAGES, FACES), []);
});
