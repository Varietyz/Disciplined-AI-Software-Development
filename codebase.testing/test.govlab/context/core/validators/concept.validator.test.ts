import { CONCEPTS, VARIANTS, createGovlabContext } from "@govlab/context";
import { unresolvedConceptRefsOf, variantIdsOf } from "@govlab/context/core/validators/concept.validator.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const refsOf = (): string[] => CONCEPTS.flatMap((concept) => [concept.home, ...concept.members]);

test("every concept home and member resolves in the bundled ontology", () => {
    const context = createGovlabContext();
    assert.deepEqual(
        unresolvedConceptRefsOf((ref) => context.resolveRef(ref)),
        [],
    );
});

test("a concept ref that resolves to no record is reported", () => {
    assert.equal(unresolvedConceptRefsOf(() => false).length, refsOf().length);
    const keep = new Set(refsOf().slice(1));
    assert.equal(unresolvedConceptRefsOf((ref) => keep.has(ref)).length, 1);
});

test("a record whose id is a declared variant is reported with its canonical form", () => {
    assert.deepEqual(
        variantIdsOf(
            new Map([
                ["reasoning:lens", ["causal", "cause"]],
                ["architecture", ["invariant"]],
            ]),
        ),
        [{ canonical: "cause", collection: "reasoning:lens", id: "causal" }],
    );
});

test("no variant names its own canonical form, and every concept id is canonical", () => {
    for (const [variant, canonical] of VARIANTS) {
        assert.notEqual(variant, canonical);
    }
    for (const concept of CONCEPTS) {
        assert.equal(VARIANTS.has(concept.id), false, concept.id);
    }
});
