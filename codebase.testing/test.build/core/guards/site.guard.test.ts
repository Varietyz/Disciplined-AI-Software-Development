import { describe, expect, it } from "vitest";
import type { SiteState } from "@banes-lab/build-scripts/types/site.types.ts";
import { composeOntology } from "@banes-lab/build-scripts/core/coordinators/ontology.coordinator.ts";
import { missingOntology } from "@banes-lab/build-scripts/configuration/strings/site.strings.ts";
import { ontologyOf } from "@banes-lab/build-scripts/core/guards/site.guard.ts";

const STATE: SiteState = {
    diagrams: { attribute: "data-walk", orderOf: () => "" },
    mode: "build",
    ontology: null,
    outDir: "out",
    root: "root",
};

describe("ontologyOf", () => {
    it("refuses a step that reads the ontology before the ontology step gave it, and hands it over after", () => {
        expect(() => ontologyOf(STATE, "graph")).toThrow(missingOntology("graph"));
        const ontology = composeOntology();
        expect(ontologyOf({ ...STATE, ontology }, "graph")).toBe(ontology);
    });
});
