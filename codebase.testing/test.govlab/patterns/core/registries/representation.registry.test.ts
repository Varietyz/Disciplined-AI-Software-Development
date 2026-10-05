import {
    definedRepresentations,
    definitionOf,
    registerRepresentation,
} from "@govlab/patterns/core/registries/representation.registry.ts";
import { describe, expect, it } from "vitest";

describe("the representation registry", () => {
    it("holds a registered definition by name", () => {
        const definition = {
            applicable: [],
            create() {
                return { findings: () => [], sample: () => null, update: () => {} };
            },
            name: "probe-representation",
        };
        registerRepresentation(definition);
        expect(definitionOf("probe-representation")).toBe(definition);
        expect(definedRepresentations()).toContain("probe-representation");
        expect(definitionOf("unregistered")).toBeUndefined();
    });
});
