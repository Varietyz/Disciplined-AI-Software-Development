import { createArchRelations, createGovlabContext, createLexicon } from "@govlab/context";
import assert from "node:assert/strict";
import { createLayerJoin } from "@govlab/context/core/factories/layer.factory.ts";
import { test } from "vitest";

const context = createGovlabContext();
const join = createLayerJoin({ algo: context.algo, arch: createArchRelations(), lex: createLexicon() });

test("the bundled layer join reads every key its data carries and seeds no dead resolution", () => {
    assert.deepEqual(join.unreadKeys(), []);
    assert.deepEqual(join.deadSeeds(), []);
});

test("the layers are the nodes the topology names, and every resolution names two ends", () => {
    const layerIds = new Set(join.layers().map((layer) => layer.id));
    for (const edge of join.topology()) {
        assert.ok(layerIds.has(edge.from) && layerIds.has(edge.to));
    }
    assert.ok(join.resolutions().every((resolution) => resolution.a.length > 0 && resolution.b.length > 0));
});
