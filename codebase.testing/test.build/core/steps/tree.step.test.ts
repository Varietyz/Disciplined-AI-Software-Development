import "@banes-lab/build-scripts/core/steps/tree.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the trees step", () => {
    it("registers as one build-only close step that runs after the chapters", () => {
        expect(registeredSteps()).toMatchObject([
            { gives: ["trees"], modes: ["build"], name: "trees", needs: ["chapters"], phase: "close" },
        ]);
    });
});
