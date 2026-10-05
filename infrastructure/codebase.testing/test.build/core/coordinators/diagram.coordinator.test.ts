import { buildDiagrams, renderDiagrams } from "@banes-lab/build-scripts/core/coordinators/diagram.coordinator.ts";
import { describe, expect, it } from "vitest";

describe("buildDiagrams", () => {
    it("is the build-start step the diagram plugin drives", () => {
        expect(typeof buildDiagrams).toBe("function");
    });
});

describe("renderDiagrams", () => {
    it("returns an empty map for no sources without launching a browser", async () => {
        expect((await renderDiagrams([])).size).toBe(0);
    });
});
