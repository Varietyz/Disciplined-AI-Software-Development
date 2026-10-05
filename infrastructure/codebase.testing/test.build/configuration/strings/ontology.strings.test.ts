import { describe, expect, it } from "vitest";
import {
    ontologyLine,
    unknownSnapshotVocabulary,
    unreadKind,
    unregisteredVocabulary,
    unresolvableTarget,
} from "@banes-lab/build-scripts/configuration/strings/ontology.strings.ts";
import { composeOntology } from "@banes-lab/build-scripts/core/coordinators/ontology.coordinator.ts";

describe("the ontology build errors", () => {
    it("name the target, kind or vocabulary each refusal is about", () => {
        expect(unresolvableTarget("gadget")).toContain('the target "gadget"');
        expect(unreadKind("gadget")).toContain('the kind "gadget" declares an inverse field');
        expect(unregisteredVocabulary("gadget")).toContain('registered as "gadget"');
        expect(unknownSnapshotVocabulary("gadget")).toContain('the vocabulary "gadget"');
    });
});

describe("ontologyLine", () => {
    it("counts the principles, terms, contracts and tensions and names the three files written", () => {
        const line = ontologyLine(
            { ontology: composeOntology(), phrases: 7, references: 9 },
            { ontology: "ontology.ts", reference: "reference.ts", vocabulary: "vocabulary.ts" },
        );
        expect(line.startsWith("ontology: wrote ")).toBe(true);
        expect(line).toContain("into ontology.ts, 7 linkable phrase(s) into vocabulary.ts");
        expect(line).toContain("9 reference record(s) beside reference.ts");
    });
});
