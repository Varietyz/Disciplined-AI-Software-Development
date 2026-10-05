import "@banes-lab/build-scripts/core/steps/link.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the links step", () => {
    it("registers as a start step in every mode that runs after the ontology", () => {
        expect(registeredSteps()).toMatchObject([
            { gives: ["links"], modes: ["build", "serve"], name: "links", needs: ["ontology"], phase: "start" },
        ]);
    });
});
