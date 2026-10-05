import {
    REASON_KINDS,
    cellOf,
    collectIds,
    kindMembersOf,
    schemaOf,
    uncoveredCellsOf,
} from "@govlab/context/core/selectors/reason.selector.ts";
import { ONTOLOGY_SCHEMA } from "@govlab/context";
import assert from "node:assert/strict";
import { bundledReason } from "../validators/ontology.fixture.ts";
import { test } from "vitest";

test("schemaOf returns a declared reasoning kind and refuses an undeclared one", () => {
    assert.ok(schemaOf("lens")["universalAxis"]);
    assert.throws(() => schemaOf("ghost-kind"), {
        message: 'reason: the kind "ghost-kind" is not declared in the reasoning taxonomy',
    });
});

test("the ontology schema declares every reasoning kind, the id-less edges, and the other collections' record kinds", () => {
    const reasoning = [...ONTOLOGY_SCHEMA.keys()].filter((key) => key.startsWith("reasoning:"));
    assert.deepEqual(
        reasoning.map((key) => key.slice("reasoning:".length)).toSorted(),
        [...REASON_KINDS.keys(), "edge"].toSorted(),
    );
    for (const key of ["algorithms:contract", "architecture:principle", "lexicon:term", "pag:keyword"]) {
        assert.ok(ONTOLOGY_SCHEMA.has(key), key);
    }
});

test("kindMembersOf holds each reasoning kind's ids, the loop's stages included", () => {
    const data = bundledReason();
    const members = kindMembersOf(data);
    assert.deepEqual([...members.keys()].toSorted(), [...REASON_KINDS.keys()].toSorted());
    const [stage] = data.derivationLoop.stages;
    assert.ok(stage);
    assert.equal(members.get("stage")?.has(stage.id), true);
    assert.equal(members.get("lens")?.has(stage.id), false);
});

test("collectIds lists every record id once, sorted, with the loop's id", () => {
    const data = bundledReason();
    const ids = collectIds(data);
    assert.ok(ids.includes(data.derivationLoop.id));
    assert.deepEqual(
        ids,
        [...new Set(ids)].toSorted((a, b) => a.localeCompare(b)),
    );
});

test("uncoveredCellsOf is the complement of the covered dimension and lens cells", () => {
    const data = bundledReason();
    const covered = new Set(data.testSurfaces.map((surface) => cellOf(surface.dimension, surface.lens)));
    const cells = uncoveredCellsOf(data);
    assert.ok(cells.every((cell) => !covered.has(cellOf(cell.dimension, cell.lens))));
    assert.equal(cells.length + covered.size, data.dimensions.length * data.lenses.length);
    assert.notEqual(cellOf("a", "b"), cellOf("b", "a"));
});
