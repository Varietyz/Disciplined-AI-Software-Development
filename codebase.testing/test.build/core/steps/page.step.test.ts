import "@banes-lab/build-scripts/core/steps/page.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the prerender step", () => {
    it("registers as a build-only close step that runs after every start step it reads", () => {
        expect(registeredSteps()).toMatchObject([
            {
                gives: ["prerender"],
                modes: ["build"],
                name: "prerender",
                needs: ["ontology", "graph", "icons", "diagrams"],
                phase: "close",
            },
        ]);
    });
});
