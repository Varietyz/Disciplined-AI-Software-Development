import { PLANTED_GATE, PLANTED_ID, plantedFaces, plantedPrinciple } from "./ontology.fixture.ts";
import { asciiArrowsIn, asciiArrowsOf } from "@govlab/context/core/validators/syntax.validator.ts";
import { ARCH_FACE } from "@govlab/constants";
import assert from "node:assert/strict";
import { createGovlabContext } from "@govlab/context";
import { test } from "vitest";

test("an ascii arrow in any field of a record is reported with its path, and the bundled data carries none", () => {
    assert.deepEqual(
        asciiArrowsIn("algorithms", "planted", { flow: ["A", "B"], productions: [{ lhs: "X", rhs: '<A> "->" <B>' }] }),
        [{ collection: "algorithms", field: "productions[0].rhs", id: "planted" }],
    );
    assert.deepEqual(asciiArrowsIn("algorithms", "clean", { rhs: '<A> "→" <B>' }), []);
    assert.deepEqual(asciiArrowsIn("pag", "arrow", { rhs: '"→" | "->"' }), []);
    assert.deepEqual(asciiArrowsIn("pag", "lone", { rhs: '"->" | "→"' }), [
        { collection: "pag", field: "rhs", id: "lone" },
    ]);
    assert.deepEqual(createGovlabContext().validateResolution().asciiArrows, []);
});

test("every face of a planted ontology is walked for ascii arrows", () => {
    const faces = plantedFaces(
        [plantedPrinciple(PLANTED_ID, { enforced_by: PLANTED_GATE, formed_by: "a planted flow A -> B" })],
        [],
    );
    assert.deepEqual(
        asciiArrowsOf(faces).filter((arrow) => arrow.collection === ARCH_FACE),
        [{ collection: ARCH_FACE, field: "formed_by", id: PLANTED_ID }],
    );
});
