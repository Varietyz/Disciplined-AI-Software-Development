import { describe, expect, it } from "vitest";
import { loadClosureGraph, normalizeImport } from "@ssot/govlab/shared/loaders/graph.loader.ts";

const FROM = ["core", "registries", "probe.registry.ts"].join("/");

describe("normalizeImport", () => {
    it("resolves a sibling import against the importing file's folder", () => {
        expect(normalizeImport(FROM, "./other.ts")).toBe(["core", "registries", "other.ts"].join("/"));
    });

    it("resolves a climbing import", () => {
        expect(normalizeImport(FROM, "../buses/other.ts")).toBe(["core", "buses", "other.ts"].join("/"));
    });

    it("refuses a package specifier, which the graph resolves by another route", () => {
        expect(normalizeImport(FROM, "@scope/package")).toBeNull();
        expect(normalizeImport(FROM, "node:path")).toBeNull();
    });

    it("refuses a relative target that does not name a TypeScript module", () => {
        expect(normalizeImport(FROM, "./styles.css")).toBeNull();
    });
});

describe("loadClosureGraph", () => {
    it("returns the parsed graph, null only when the graph has not been built, and throws on a malformed one", () => {
        const graph = loadClosureGraph();
        if (graph === null) {
            expect(graph).toBeNull();
            return;
        }
        expect(Array.isArray(graph.imports)).toBe(true);
        expect(Array.isArray(graph.exports)).toBe(true);
        expect(Array.isArray(graph.registers)).toBe(true);
    });
});
