import "@banes-lab/build-scripts/core/steps/diagram.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the diagrams step", () => {
    it("registers as a start step of the build only that runs after the metrics", () => {
        expect(registeredSteps()).toMatchObject([
            { gives: ["diagrams"], modes: ["build"], name: "diagrams", needs: ["metrics"], phase: "start" },
        ]);
    });
});
