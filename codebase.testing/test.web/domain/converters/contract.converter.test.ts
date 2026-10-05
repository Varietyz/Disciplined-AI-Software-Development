import { describe, expect, it } from "vitest";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";
import { contractSections } from "@banes-lab/web/domain/converters/contract.converter.ts";

describe("contractSections", () => {
    it("renders one section per domain and one subsection per contract", () => {
        const sections = contractSections(ONTOLOGY.contracts, ONTOLOGY.resolution);
        expect(sections).toHaveLength(ONTOLOGY.contracts.length);
        expect(sections.reduce((total, section) => total + section.subsections.length, 0)).toBe(
            ONTOLOGY.contracts.reduce((total, group) => total + group.contracts.length, 0),
        );
    });
});
