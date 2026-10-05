import {
    normalizeFailureShape,
    normalizeInvariant,
    normalizeTechnique,
    normalizeTestSurface,
} from "@govlab/context/core/normalizers/reason.surface.normalizer.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const SURFACE = {
    dimension: "meaning",
    evidence: { grounds: ["ver-evidence"], required: true, source: "test-result" },
    id: "s-sem",
    lens: "semantic",
    predicate: { expression: "x", type: "equivalence" },
    verdictDomain: ["pass", "fail"],
};

test("a test surface keeps its closed values and refuses a value outside them", () => {
    const surface = normalizeTestSurface(SURFACE);
    assert.equal(surface.evidence.source, "test-result");
    assert.equal(surface.predicate.type, "equivalence");
    assert.deepEqual(surface.verdictDomain, ["pass", "fail"]);
    assert.throws(() => normalizeTestSurface({ ...SURFACE, verdictDomain: ["maybe"] }));
    assert.throws(() => normalizeTestSurface({ ...SURFACE, predicate: { type: "vibes" } }));
});

test("a technique, an invariant and a failure shape keep their fields", () => {
    assert.equal("principleRef" in normalizeTechnique({ fails: "f", id: "t", mode: "m", principle: "p" }), false);
    assert.equal(normalizeTechnique({ id: "t", principleRef: "r" }).principleRef, "r");
    assert.deepEqual(normalizeInvariant({ id: "i", name: "I", statement: "s" }), {
        id: "i",
        name: "I",
        statement: "s",
    });
    assert.deepEqual(normalizeFailureShape({ id: "f", instances: ["algorithms:x"] }).instances, ["algorithms:x"]);
});
