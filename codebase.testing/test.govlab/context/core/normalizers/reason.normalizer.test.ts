import {
    aliased,
    normalizeAxis,
    normalizeDerivationLoop,
    normalizeDimension,
    normalizeEdge,
    normalizeLayer,
    normalizeLens,
    normalizeMaps,
    normalizeMathDomain,
    normalizeMathType,
    normalizeMode,
    normalizeModel,
    normalizeNode,
    normalizePatternType,
    normalizeRepresentation,
    normalizeSubstrate,
    normalizeUniversalAxis,
    refused,
} from "@govlab/context/core/normalizers/reason.normalizer.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("each reasoning record keeps its fields and adds an optional field only when it carries one", () => {
    assert.deepEqual(normalizeLayer({ id: "l", label: "L", question: "q" }), { id: "l", label: "L", question: "q" });
    assert.deepEqual(normalizeMathType({ id: "m", yieldsShape: "boolean" }).domains, []);
    assert.equal(normalizeAxis({ id: "a", selectable: true }).selectable, true);
    assert.equal("concept" in normalizeNode({ axis: "a", id: "n", mathType: "m", name: "N" }), false);
    assert.equal(normalizeNode({ concept: "c", id: "n" }).concept, "c");
    assert.deepEqual(normalizeEdge({ from: "n", label: "prose" }), { from: "n", label: "prose" });
    assert.deepEqual(normalizeDimension({ id: "d" }).mathDomains, []);
    assert.deepEqual(normalizeLens({ detectedBy: ["algorithms:x"], id: "l" }).detectedBy, ["algorithms:x"]);
    assert.equal("question" in normalizeMode({ id: "m", practice: "p" }), false);
    assert.equal(normalizeRepresentation({ expression: "e", id: "r", label: "R" }).label, "R");
    assert.equal(normalizeMathDomain({ id: "d", studies: "s" }).studies, "s");
    assert.equal(normalizePatternType({ id: "p", viewpoint: "v" }).viewpoint, "v");
    assert.deepEqual(normalizeUniversalAxis({ id: "u", subsumes: ["d"] }).subsumes, ["d"]);
});

test("a model keeps its recursion only when one is declared", () => {
    assert.equal("recursion" in normalizeModel({ id: "m", sequence: ["a"], stepKind: "mode" }), false);
    assert.deepEqual(normalizeModel({ id: "m", recursion: { from: "b", to: "a" } }).recursion, { from: "b", to: "a" });
});

test("the substrate and the loop check their nested records against their kinds", () => {
    const substrate = normalizeSubstrate({
        cycle: ["a"],
        nodes: [{ id: "s", layer: "l", mathType: "m", name: "S" }],
        recursion: {},
    });
    assert.equal(substrate.nodes.length, 1);
    assert.deepEqual(substrate.recursion, { from: "", to: "" });
    const loop = normalizeDerivationLoop({
        id: "dl",
        stages: [{ axis: "a", id: "s1" }],
        transitions: [{ from: "s1", kind: "advance", to: "s1" }],
    });
    assert.equal(loop.stages.length, 1);
    assert.throws(() => normalizeDerivationLoop({ id: "dl", stages: [{ id: "s1" }] }));
});

test("the maps keep each list under its key", () => {
    const maps = normalizeMaps({
        foundations: { layers: { l: ["a"] }, sequence: ["l"] },
        invariants: { i: ["x"] },
        patternOperations: ["op"],
    });
    assert.deepEqual(maps.foundations.layers, { l: ["a"] });
    assert.deepEqual(maps.invariants, { i: ["x"] });
    assert.deepEqual(normalizeMaps({}).patternOperations, []);
});

test("refused checks a reasoning record against its kind before normalizing it", () => {
    assert.throws(() => refused("layer", normalizeLayer)({ id: "l" }));
    assert.throws(() => refused("ghost-kind", normalizeLayer)({}));
    assert.deepEqual(refused("edge", normalizeEdge)({ aliases: ["e"], from: "n" }), { from: "n" });
});

test("aliased keeps the aliases a named reasoning record declares", () => {
    const layer = { id: "l", label: "L", question: "q" };
    assert.deepEqual(aliased("layer", normalizeLayer)({ ...layer, aliases: ["tier"] }).aliases, ["tier"]);
    assert.equal("aliases" in aliased("layer", normalizeLayer)(layer), false);
});
