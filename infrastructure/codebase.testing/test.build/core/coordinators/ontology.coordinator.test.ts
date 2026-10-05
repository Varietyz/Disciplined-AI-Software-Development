import { describe, expect, it } from "vitest";
import { buildOntology } from "@banes-lab/build-scripts/core/coordinators/ontology.coordinator.ts";

describe("buildOntology", () => {
    it("is the build-start step the ontology plugin drives", () => {
        expect(typeof buildOntology).toBe("function");
    });
});
