import { buildGraph, deriveGraph } from "@banes-lab/build-scripts/core/coordinators/graph.coordinator.ts";
import { describe, expect, it } from "vitest";
import type { Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import { composeOntology } from "@banes-lab/build-scripts/core/coordinators/ontology.coordinator.ts";

const DISCOVERY: Discovery = {
    author: "",
    consent: "",
    name: "",
    pages: [],
    routes: [],
    site: "https://example.test",
    summary: "",
};

const isModule = function isModule<T>(value: unknown): value is T {
    return typeof value === "object" && value !== null;
};

describe("deriveGraph", () => {
    it("is the build-start step the graph plugin drives", () => {
        expect(typeof deriveGraph).toBe("function");
    });
});

describe("buildGraph", () => {
    it("reaches the web member only through the runner it is handed", async () => {
        const seen: string[] = [];
        const importer = {
            import: async <T>(url: string): Promise<T> => {
                await Promise.resolve();
                seen.push(url);
                const module: unknown = Object.create(null);
                if (!isModule<T>(module)) {
                    throw new TypeError(url);
                }
                return module;
            },
        };
        await expect(buildGraph(importer, DISCOVERY, [], composeOntology())).rejects.toThrow(TypeError);
        expect(seen.length).toBeGreaterThan(0);
        expect(seen.every((url) => url.startsWith("@banes-lab/web/"))).toBe(true);
    });
});
