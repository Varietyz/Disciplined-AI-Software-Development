import "@banes-lab/build-scripts/core/steps/metric.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the metrics step", () => {
    it("registers as a start step in every mode that runs after the ontology", () => {
        expect(registeredSteps()).toMatchObject([
            { gives: ["metrics"], modes: ["build", "serve"], name: "metrics", needs: ["ontology"], phase: "start" },
        ]);
    });
});
