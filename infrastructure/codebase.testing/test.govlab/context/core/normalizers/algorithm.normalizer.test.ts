import assert from "node:assert/strict";
import { normalizeContract } from "@govlab/context/core/normalizers/algorithm.normalizer.ts";
import { test } from "vitest";

const RAW = {
    composes: ["leaf"],
    flow: ["Read"],
    force: ["speed"],
    id: "planted-contract",
    intent: "i",
    invariant: "v",
    productions: [{ lhs: "Node", rhs: "<x>" }],
    title: "Planted Contract",
};

test("normalizeContract takes the tier from its group and keeps only the optional fields it carries", () => {
    const contract = normalizeContract({ ...RAW, grounds: ["reasoning:ter-stop"], stage: "verify" }, "pag", null, {
        tier: "process",
    });
    assert.equal(contract.id, "planted-contract");
    assert.equal(contract.tier, "process");
    assert.equal(contract.stage, "verify");
    assert.deepEqual(contract.grounds, ["reasoning:ter-stop"]);
    assert.equal("derivationMap" in contract, false);
    assert.equal("meta" in contract, false);
});

test("normalizeContract refuses a tier outside the closed vocabulary and a record missing a required field", () => {
    assert.throws(() => normalizeContract(RAW, "pag", null, { tier: "ghost" }));
    assert.throws(() => normalizeContract({ title: "t" }, "pag", null, { tier: "leaf" }));
});
