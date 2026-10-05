import { describe, expect, it } from "vitest";
import { discoverSources } from "@banes-lab/build-scripts/core/loaders/diagram.loader.ts";

describe("discoverSources", () => {
    it("collects every mermaid source declared across the strings modules, sorted and deduplicated", async () => {
        const sources = await discoverSources();
        expect(sources.length).toBeGreaterThan(0);
        expect(sources.every((source) => source.trim().length > 0)).toBe(true);
        expect(new Set(sources).size).toBe(sources.length);
        expect([...sources].toSorted()).toStrictEqual(sources);
    });
});
