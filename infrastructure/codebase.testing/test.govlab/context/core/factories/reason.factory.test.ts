import { REASON_FACE, createReason } from "@govlab/context";
import assert from "node:assert/strict";
import { test } from "vitest";

test("the bundled reason ontology validates clean", () => {
    assert.equal(createReason().validateReasonOntology().total, 0);
    assert.equal(REASON_FACE.name, "reasoning");
});

test("createReason resolves a test surface, technique and invariant id to its kind", () => {
    const reason = createReason();
    assert.equal(reason.resolve("semantic-correctness")?.kind, "test-surface");
    assert.equal(reason.resolve("unit-testing")?.kind, "technique");
    assert.equal(reason.resolve("correct-outputs")?.kind, "invariant");
});

test("createReason resolves core reason ids and refuses an unknown id", () => {
    const reason = createReason();
    for (const id of ["derivation-loop", "tel-priority", "ter-stop", "ver-evidence"]) {
        assert.ok(reason.resolve(id), id);
    }
    assert.equal(reason.resolve("does-not-exist-anywhere"), null);
});

test("uncoveredCells derives the grid complement of the covered cells", () => {
    const reason = createReason();
    const cells = reason.uncoveredCells();
    const covered = new Set(reason.testSurfaces().map((surface) => `${surface.dimension}::${surface.lens}`));
    assert.ok(cells.length > 0);
    assert.ok(cells.every((cell) => !covered.has(`${cell.dimension}::${cell.lens}`)));
});
