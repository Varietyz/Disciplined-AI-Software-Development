import {
    freeRefs,
    kept,
    listedBy,
    optionalRef,
    optionalRefs,
    ref,
    refs,
} from "@govlab/context/core/factories/field.factory.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("ref and refs are required, and carry their target and inverse", () => {
    assert.deepEqual(ref("reasoning:axis", "nodes"), {
        inverse: "nodes",
        required: true,
        target: "reasoning:axis",
        type: "ref",
    });
    assert.deepEqual(refs("reasoning:node"), { required: true, target: "reasoning:node", type: "refs" });
});

test("optionalRef, optionalRefs and freeRefs are optional, and carry the declared inverse", () => {
    assert.deepEqual(optionalRef("architecture"), { required: false, target: "architecture", type: "ref" });
    assert.deepEqual(optionalRefs("algorithms", "composed-by"), {
        inverse: "composed-by",
        required: false,
        target: "algorithms",
        type: "refs",
    });
    assert.deepEqual(optionalRefs("algorithms"), { required: false, target: "algorithms", type: "refs" });
    assert.deepEqual(freeRefs("grounded-by"), { inverse: "grounded-by", required: false, type: "refs" });
});

test("listedBy flips the relation onto its target, and kept holds it on the record", () => {
    assert.deepEqual(listedBy(ref("reasoning:mode"), "techniques"), {
        flip: true,
        relation: "techniques",
        required: true,
        target: "reasoning:mode",
        type: "ref",
    });
    assert.deepEqual(kept(refs("reasoning:node"), "grounds"), {
        flip: false,
        relation: "grounds",
        required: true,
        target: "reasoning:node",
        type: "refs",
    });
});
