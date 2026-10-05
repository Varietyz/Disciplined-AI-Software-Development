import { describe, expect, it } from "vitest";
import { inferMapping, unrepresentable } from "@govlab/patterns/core/resolvers/representation.resolver.ts";
import { detectSchema } from "@govlab/patterns/core/analyzers/schema.analyzer.ts";
import { runtimeFor } from "@govlab/patterns/core/selectors/representation.selector.ts";

describe("inferMapping", () => {
    it("maps each field kind onto its representations", () => {
        const mapping = inferMapping(
            detectSchema([{ color: "red", meta: { a: 1 }, point: [0, 0], score: 1, tags: ["a"] }]),
        );
        expect(mapping.get("color")).toStrictEqual(["distribution", "sequence"]);
        expect(mapping.get("score")).toStrictEqual(["vector", "sequence"]);
        expect(mapping.get("point")).toStrictEqual(["grid"]);
        expect(mapping.get("tags")).toStrictEqual(["graph"]);
        expect(mapping.get("meta")).toStrictEqual(["tree"]);
    });

    it("names only representations the registry holds", () => {
        const mapping = inferMapping(detectSchema([{ a: "x", b: 1, c: [1, 2, 3], d: { e: 1 } }]));
        for (const representations of mapping.values()) {
            expect(representations.every((name) => runtimeFor(name) !== undefined)).toBe(true);
        }
    });
});

describe("unrepresentable", () => {
    it("reports the fields no representation can analyze", () => {
        const names = unrepresentable(detectSchema([{ a: 1, b: null }])).map((field) => field.name);
        expect(names).toStrictEqual(["b"]);
    });
});
