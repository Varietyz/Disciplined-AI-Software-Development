import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import assert from "node:assert/strict";
import { loadPrinciples } from "@govlab/context/core/loaders/architecture.loader.ts";
import { plantedPrinciple } from "../validators/ontology.fixture.ts";
import { test } from "vitest";

test("the bundled principles load and every key their data carries is read", () => {
    const audit = new ReadAudit("architecture");
    assert.ok(loadPrinciples(audit).length > 0);
    assert.deepEqual(audit.unread(), []);
});

test("planted categories load in place of the bundled data", () => {
    const principles = loadPrinciples(new ReadAudit("architecture"), [plantedPrinciple("planted-rule")]);
    assert.deepEqual(
        principles.map((principle) => principle.id),
        ["planted-rule"],
    );
});
