import "@banes-lab/build-scripts/core/steps/graph.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the graph step", () => {
    it("registers as a start step in every mode that runs after the ontology, the metrics and the links", () => {
        expect(registeredSteps()).toMatchObject([
            {
                gives: ["graph"],
                modes: ["build", "serve"],
                name: "graph",
                needs: ["ontology", "metrics", "links"],
                phase: "start",
            },
        ]);
    });
});
