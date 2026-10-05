import { describe, expect, it } from "vitest";
import { createGovlabContext } from "@govlab/context";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";
import { createReverseIndex } from "@banes-lab/build-scripts/core/converters/ontology.index.converter.ts";
import { reasonOf } from "@banes-lab/build-scripts/core/converters/reason.converter.ts";

const context = createGovlabContext();
const resolve = createResolver(context);
const reason = reasonOf(context, resolve, createReverseIndex(context, resolve));

describe("reasonOf", () => {
    it("carries every collection the reasoning collection exposes, with its cross references resolved", () => {
        const { reason: face } = context;
        expect(reason.axes).toHaveLength(face.axes().length);
        expect(reason.nodes).toHaveLength(face.nodes().length);
        expect(reason.lenses).toHaveLength(face.lenses().length);
        expect(reason.testSurfaces).toHaveLength(face.testSurfaces().length);
        expect(reason.techniques).toHaveLength(face.techniques().length);
        expect(reason.layers).toHaveLength(face.layers().length);
        expect(reason.edges).toHaveLength(face.edges().length);
        expect(reason.derivationLoop.stages).toHaveLength(face.derivationLoop().stages.length);
        const layerOf = new Map(face.axes().map((axis) => [axis.id, axis.layer]));
        expect(reason.axes.every((axis) => axis.layer.ref === `reasoning:layer-${layerOf.get(axis.id) ?? ""}`)).toBe(
            true,
        );
        expect(reason.nodes.every((node) => node.anchor === `node-${node.id}`)).toBe(true);
        expect(reason.nodes.every((node) => node.axis.ref !== null && node.mathType.ref !== null)).toBe(true);
        expect(
            reason.testSurfaces.every(
                (surface) =>
                    surface.dimension.ref !== null && surface.lens.ref !== null && surface.invariant.ref !== null,
            ),
        ).toBe(true);
        expect(reason.techniques.every((technique) => technique.mode.ref !== null)).toBe(true);
    });

    it("joins the collections both ways: layers know their axes, modes their techniques, dimensions and invariants their surfaces", () => {
        expect(reason.layers.some((layer) => layer.axes.length > 0)).toBe(true);
        expect(reason.modes.some((mode) => mode.techniques.length > 0)).toBe(true);
        expect(reason.dimensions.some((dimension) => dimension.surfaces.length > 0)).toBe(true);
        expect(reason.invariants.some((invariant) => invariant.surfaces.length > 0)).toBe(true);
        expect(reason.lenses.some((lens) => lens.testSurfaces.length > 0)).toBe(true);
        expect(reason.universalAxes.some((axis) => axis.lenses.length > 0)).toBe(true);
        expect(reason.substrate.nodes.every((node) => node.mathType.ref !== null)).toBe(true);
        expect(reason.maps.foundationSequence.length).toBeGreaterThan(0);
        expect(reason.derivationLoop.stages.some((stage) => stage.edges.length > 0)).toBe(true);
    });
});
