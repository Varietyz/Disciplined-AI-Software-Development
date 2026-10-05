import { describe, expect, it } from "vitest";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";
import { principleSections } from "@banes-lab/web/domain/converters/principle.converter.ts";

describe("principleSections", () => {
    it("renders one section per category and one addressable subsection per principle with a diagram", () => {
        const sections = principleSections(ONTOLOGY.principles, ONTOLOGY.resolution);
        expect(sections).toHaveLength(ONTOLOGY.principles.length);
        expect(sections.reduce((total, section) => total + section.subsections.length, 0)).toBe(
            ONTOLOGY.principles.reduce((total, group) => total + group.principles.length, 0),
        );
        expect(sections[0]?.blocks?.[0]?.kind).toBe("mermaid");
        expect(sections[0]?.id.startsWith("architecture-category-")).toBe(true);
        expect(sections[0]?.subsections[0]?.id?.startsWith("architecture-")).toBe(true);
        expect(sections[0]?.subsections[0]?.blocks?.[0]?.kind).toBe("list");
    });
});
