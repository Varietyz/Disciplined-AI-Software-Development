import { EDGE_SECTION_ID, MAP_SECTION_ID, UNCOVERED_SECTION_ID } from "@banes-lab/web/core/ids/ontology.ids.ts";
import { describe, expect, it } from "vitest";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";
import { structureSections } from "@banes-lab/web/domain/converters/structure.converter.ts";

describe("structureSections", () => {
    it("renders the uncovered cells, the maps and the edges in that order", () => {
        const sections = structureSections(ONTOLOGY.reason);
        expect(sections.map((section) => section.id)).toStrictEqual([
            UNCOVERED_SECTION_ID,
            MAP_SECTION_ID,
            EDGE_SECTION_ID,
        ]);
    });
});
