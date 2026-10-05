import { describe, expect, it } from "vitest";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";
import { failureShapeSection } from "@banes-lab/web/domain/converters/failure.converter.ts";

describe("failureShapeSection", () => {
    it("renders one subsection per failure shape, each closed by its check", () => {
        const section = failureShapeSection(ONTOLOGY.reason, ONTOLOGY.resolution);
        expect(section.subsections).toHaveLength(ONTOLOGY.reason.failureShapes.length);
        expect(section.subsections.every((subsection) => (subsection.blocks?.length ?? 0) > 1)).toBe(true);
    });
});
