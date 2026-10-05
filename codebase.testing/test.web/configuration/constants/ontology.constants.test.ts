import { describe, expect, it } from "vitest";
import { ONTOLOGY_GRAPH } from "@banes-lab/web/configuration/constants/ontology.constants.ts";
import { ONTOLOGY_TABS } from "@banes-lab/web/configuration/strings/ontology.fragment.strings.ts";

describe("ONTOLOGY_GRAPH", () => {
    it("declares every built section as narrative", () => {
        const built = ONTOLOGY_TABS.flatMap((tab) => tab.sections.map((section) => section.id));
        for (const id of built) {
            expect(ONTOLOGY_GRAPH.sections[id]?.narrative).toBe(true);
        }
    });
});
