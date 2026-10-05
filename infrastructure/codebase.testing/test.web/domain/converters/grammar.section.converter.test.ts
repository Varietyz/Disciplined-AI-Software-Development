import { describe, expect, it } from "vitest";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";
import { grammarSections } from "@banes-lab/web/domain/converters/grammar.section.converter.ts";

describe("grammarSections", () => {
    it("renders a section per keyword category and production group, then the document types and the templates", () => {
        const { grammar, resolution } = ONTOLOGY;
        const sections = grammarSections(grammar, resolution);
        expect(sections).toHaveLength(grammar.categories.length + grammar.groups.length + 2);
        expect(sections.at(-1)?.subsections).toHaveLength(grammar.templates.length);
    });
});
