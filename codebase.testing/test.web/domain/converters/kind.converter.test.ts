import { describe, expect, it } from "vitest";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";
import { kindSections } from "@banes-lab/web/domain/converters/kind.converter.ts";
import { resolutionNoteOf } from "@banes-lab/web/configuration/strings/ontology.strings.ts";

describe("kindSections", () => {
    it("renders the kinds, every vocabulary, the ranges and the forces", () => {
        const kinds = kindSections({
            coverage: ONTOLOGY.resolution.coverage,
            forces: ONTOLOGY.forces,
            kinds: ONTOLOGY.kinds,
            note: resolutionNoteOf(1, 0),
            ranges: ONTOLOGY.ranges,
            vocabularies: ONTOLOGY.vocabularies,
        });
        const vocabularyCount = ONTOLOGY.vocabularies.length;
        expect(kinds).toHaveLength(vocabularyCount + 3);
        expect(kinds[0]?.subsections).toHaveLength(ONTOLOGY.kinds.length + 1);
        expect(kinds[vocabularyCount + 1]?.blocks?.[0]?.kind).toBe("mermaid");
        expect(kinds[vocabularyCount + 2]?.subsections).toHaveLength(ONTOLOGY.forces.length);
    });
});
