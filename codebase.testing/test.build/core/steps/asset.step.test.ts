import "@banes-lab/build-scripts/core/steps/asset.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the prune step", () => {
    it("registers as a build-only close step that runs after the prerender", () => {
        expect(registeredSteps()).toMatchObject([
            { gives: ["prune"], modes: ["build"], name: "prune", needs: ["prerender"], phase: "close" },
        ]);
    });
});
