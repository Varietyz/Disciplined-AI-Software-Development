import {
    buildLayerByKey,
    buildLiveEdgePairs,
    buildRefMaps,
    buildResolutionByPair,
    layerOf,
    pairKey,
    resolveTension,
} from "@govlab/context/core/resolvers/layer.resolver.ts";
import type { JoinState } from "@govlab/context/types/layer.types.ts";
import assert from "node:assert/strict";
import { createArchRelations } from "@govlab/context";
import { plantedPrinciple } from "../validators/ontology.fixture.ts";
import { test } from "vitest";

const SPEED = "speed-rule";
const CARE = "care-rule";
const UNKNOWN = "nothing-here";

const arch = createArchRelations({
    data: [
        { ...plantedPrinciple(SPEED, { tensions_with: [CARE] }), category: "runtime" },
        { ...plantedPrinciple(CARE), category: "domain" },
    ],
});

const refs = buildRefMaps(arch);

const stateOf = (over: Partial<JoinState> = {}): JoinState => ({
    edges: [],
    layerByKey: buildLayerByKey([
        { key: "runtime", layer: "runtime-layer" },
        { key: "domain", layer: "domain-layer" },
    ]),
    liveEdgePairs: buildLiveEdgePairs(arch, refs),
    refs,
    resolutionByPair: new Map(),
    resolutionList: [],
    termCategoryOf: () => null,
    titleOf: () => null,
    ...over,
});

test("pairKey is the same whichever way round the pair is named", () => {
    assert.equal(pairKey(refs, SPEED, CARE), pairKey(refs, CARE, SPEED));
    assert.equal(refs.archIdByRef.get(SPEED), SPEED);
});

test("buildLiveEdgePairs holds each tension edge the principles declare", () => {
    assert.ok(buildLiveEdgePairs(arch, refs).has(pairKey(refs, SPEED, CARE)));
});

test("layerOf reads a principle's layer through its category, and answers null for an unknown name", () => {
    const state = stateOf();
    assert.equal(layerOf(state, SPEED), "runtime-layer");
    assert.equal(layerOf(state, UNKNOWN), null);
});

test("two principles in different layers resolve by scope separation, and an explicit seed wins", () => {
    assert.equal(resolveTension(stateOf(), SPEED, CARE)?.mechanism, "scope-separation");
    const seed = { a: CARE, b: SPEED, mechanism: "mitigation" as const, rule: "r", scopeA: "x", scopeB: "y" };
    const seeded = stateOf({ resolutionByPair: buildResolutionByPair([seed], refs), resolutionList: [seed] });
    assert.equal(resolveTension(seeded, SPEED, CARE), seed);
    assert.equal(resolveTension(stateOf(), SPEED, UNKNOWN), null);
});

test("two ends in one layer resolve as an irreducible tradeoff", () => {
    const state = stateOf({
        layerByKey: buildLayerByKey([
            { key: "runtime", layer: "one" },
            { key: "domain", layer: "one" },
        ]),
    });
    assert.equal(resolveTension(state, SPEED, CARE)?.mechanism, "irreducible-tradeoff");
});
