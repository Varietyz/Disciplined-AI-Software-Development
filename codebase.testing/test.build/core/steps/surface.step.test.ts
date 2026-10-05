import "@banes-lab/build-scripts/core/steps/surface.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the surfaces step", () => {
    it("registers as a start step in every mode that needs nothing", () => {
        expect(registeredSteps()).toMatchObject([
            { gives: ["surfaces"], modes: ["build", "serve"], name: "surfaces", needs: [], phase: "start" },
        ]);
    });
});
