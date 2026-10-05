import { describe, expect, it } from "vitest";
import {
    missingCheck,
    missingVocabularySection,
    unlabeledCoverage,
} from "@banes-lab/web/configuration/strings/ontology.strings.ts";

describe("the ontology page build errors", () => {
    it("name the coverage id, the vocabulary that has no copy, or the record that has no check", () => {
        expect(unlabeledCoverage("shape")).toContain('names "shape", and no label is declared for it');
        expect(missingVocabularySection("maturity")).toContain('the vocabulary "maturity" has no section copy');
        expect(missingCheck("architecture:dry")).toContain("no check for architecture:dry");
    });
});
