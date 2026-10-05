import { describe, expect, it } from "vitest";
import { catalogsOf } from "@banes-lab/build-scripts/core/converters/reason.catalog.converter.ts";
import { createGovlabContext } from "@govlab/context";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";
import { createReverseIndex } from "@banes-lab/build-scripts/core/converters/ontology.index.converter.ts";

describe("catalogsOf", () => {
    it("gives each catalog one view per record, joined to the surfaces, axes, techniques and lenses that name it", () => {
        const context = createGovlabContext();
        const resolve = createResolver(context);
        const catalogs = catalogsOf({ context, index: createReverseIndex(context, resolve), resolve });
        expect(catalogs.dimensions).toHaveLength(context.reason.dimensions().length);
        expect(catalogs.invariants.some((invariant) => invariant.surfaces.length > 0)).toBe(true);
        expect(catalogs.layers.some((layer) => layer.axes.length > 0)).toBe(true);
        expect(catalogs.modes.some((mode) => mode.techniques.length > 0)).toBe(true);
        expect(catalogs.universalAxes.some((axis) => axis.lenses.length > 0)).toBe(true);
    });
});
