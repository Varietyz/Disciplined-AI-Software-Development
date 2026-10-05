import { describe, expect, it } from "vitest";
import {
    forceNames,
    forcesOf,
    kindsOf,
    layersOf,
    rangesOf,
} from "@banes-lab/build-scripts/core/converters/layer.converter.ts";
import { createGovlabContext } from "@govlab/context";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";

const context = createGovlabContext();
const resolve = createResolver(context);

describe("layersOf", () => {
    const layers = layersOf(context, resolve);

    it("renders every layer node as a contract link with the categories that belong to it", () => {
        expect(layers.nodes).toHaveLength(context.layers().length);
        for (const layer of layers.nodes) {
            expect(layer.contract.ref).toBe(`algorithms:${layer.id}`);
        }
        expect(layers.nodes.some((layer) => layer.members.length > 0)).toBe(true);
        expect(layers.topology).toHaveLength(context.topology().length);
        expect(
            layers.topology.every(
                (edge) => edge.from.ref?.startsWith("layer:") === true && edge.to.ref?.startsWith("layer:") === true,
            ),
        ).toBe(true);
    });

    it("gives each layer the topology edges that leave it and the ones that reach it, so the page derives neither", () => {
        for (const layer of layers.nodes) {
            const ref = `layer:${layer.id}`;
            expect(layer.outgoing).toStrictEqual(layers.topology.filter((edge) => edge.from.ref === ref));
            expect(layer.incoming).toStrictEqual(layers.topology.filter((edge) => edge.to.ref === ref));
        }
        const placed = layers.nodes.reduce((total, layer) => total + layer.outgoing.length, 0);
        expect(placed).toBe(layers.topology.length);
    });

    it("maps every principle category and every extra term category to a layer link, and ids every resolution", () => {
        const archCategories = new Set(context.arch.all().map((principle) => principle.category));
        expect(layers.membership.length).toBeGreaterThanOrEqual(archCategories.size);
        expect(layers.membership.every((entry) => entry.category.ref !== null)).toBe(true);
        expect(
            layers.resolutions.every(
                (tension) => tension.id.length > 0 && tension.scopeA.ref?.startsWith("layer:") === true,
            ),
        ).toBe(true);
        expect(new Set(layers.resolutions.map((tension) => tension.id)).size).toBe(layers.resolutions.length);
    });
});

describe("kindsOf, rangesOf, forceNames and forcesOf", () => {
    it("counts the principles and terms of each kind and links each range to its kinds", () => {
        const kinds = kindsOf(context);
        expect(kinds.reduce((total, kind) => total + kind.principles, 0)).toBe(context.arch.ids().length);
        expect(kinds.reduce((total, kind) => total + kind.terms, 0)).toBe(context.lex.ids().length);
        const ranges = rangesOf(resolve);
        expect(ranges.length).toBeGreaterThan(0);
        expect(ranges.every((range) => range.kinds.every((kind) => kind.ref === `kind:${kind.label}`))).toBe(true);
    });

    it("keeps only the canonical forces and joins each to its contracts and principles", () => {
        const names = forceNames(context);
        expect(names.has("modularity")).toBe(true);
        expect([...names].some((force) => force.includes("("))).toBe(false);
        const forces = forcesOf(context, resolve);
        expect(forces.map((force) => force.force)).toStrictEqual([...names]);
        expect(forces.some((force) => force.principles.length > 0)).toBe(true);
        expect(forces.every((force) => force.contracts.every((contract) => contract.ref !== null))).toBe(true);
    });
});
