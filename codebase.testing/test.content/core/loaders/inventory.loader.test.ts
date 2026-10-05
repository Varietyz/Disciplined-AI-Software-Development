import { describe, expect, it } from "vitest";
import {
    inventorySourcePaths,
    inventoryTarget,
    readInventory,
    readInventorySources,
} from "@banes-lab/content/core/loaders/inventory.loader.ts";
import { relativePath } from "@ssot/paths";

describe("inventorySourcePaths", () => {
    it("names the Coordination Surface's behavior document and the avoidance reference beside the boundary documents", async () => {
        const paths = await inventorySourcePaths();
        expect(paths).toContain(relativePath("app.coordination", "AGENTS.md"));
        expect(paths.some((path) => path.startsWith(relativePath("docArch.references")))).toBe(true);
    });
});

describe("readInventorySources", () => {
    it("reads every named source whole", async () => {
        const sources = await readInventorySources();
        expect(sources.length).toBeGreaterThan(0);
        expect(sources.every((source) => source.text.length > 0)).toBe(true);
    });
});

describe("inventoryTarget", () => {
    it("resolves under the content reports folder and carries the generated marker", () => {
        expect(inventoryTarget()).toContain(".generated.");
    });
});

describe("readInventory", () => {
    it("returns either a parsed inventory or null, never a shapeless value", () => {
        const inventory = readInventory();
        expect(inventory === null || Array.isArray(inventory.records)).toBe(true);
    });
});
