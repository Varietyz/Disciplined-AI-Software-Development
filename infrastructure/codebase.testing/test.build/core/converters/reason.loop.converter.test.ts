import { describe, expect, it } from "vitest";
import {
    edgesOf,
    loopOf,
    mapsOf,
    substrateOf,
} from "@banes-lab/build-scripts/core/converters/reason.loop.converter.ts";
import { createGovlabContext } from "@govlab/context";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";
import { createReverseIndex } from "@banes-lab/build-scripts/core/converters/ontology.index.converter.ts";

const context = createGovlabContext();
const resolve = createResolver(context);
const sources = { context, index: createReverseIndex(context, resolve), resolve };

describe("loopOf and edgesOf", () => {
    it("carries every loop stage and every reasoning edge, with the stage transitions resolved", () => {
        const loop = loopOf(sources);
        expect(loop.stages).toHaveLength(context.reason.derivationLoop().stages.length);
        expect(loop.transitions.every((transition) => transition.from.ref !== null)).toBe(true);
        expect(edgesOf(sources)).toHaveLength(context.reason.edges().length);
    });
});

describe("substrateOf and mapsOf", () => {
    it("resolves every substrate node and every map entry to a reasoning record", () => {
        const substrate = substrateOf(sources);
        expect(substrate.nodes).toHaveLength(context.reason.substrate().nodes.length);
        expect(substrate.cycle.every((stage) => stage.ref !== null)).toBe(true);
        expect(mapsOf(sources).foundationSequence.length).toBeGreaterThan(0);
    });
});
