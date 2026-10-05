import "@banes-lab/build-scripts/core/steps/icons.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the icons step", () => {
    it("registers as a start step in every mode that runs after the metrics", () => {
        expect(registeredSteps()).toMatchObject([
            { gives: ["icons"], modes: ["build", "serve"], name: "icons", needs: ["metrics"], phase: "start" },
        ]);
    });
});
