import "@banes-lab/build-scripts/core/steps/ontology.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the ontology step", () => {
    it("registers as the first start step in every mode, with nothing it waits for", () => {
        expect(registeredSteps()).toMatchObject([
            { gives: ["ontology"], modes: ["build", "serve"], name: "ontology", needs: [], phase: "start" },
        ]);
    });
});
