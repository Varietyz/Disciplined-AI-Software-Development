import { describe, expect, it } from "vitest";
import { recordSurfaces } from "@banes-lab/build-scripts/core/coordinators/surface.coordinator.ts";

describe("recordSurfaces", () => {
    it("records every figure the scenario names, or reuses them when their inputs are unchanged", async () => {
        const first = await recordSurfaces();
        expect(first.figures).toBeGreaterThan(0);
        const second = await recordSurfaces();
        expect(second).toStrictEqual({ figures: first.figures, reused: true });
    }, 300_000);
});
