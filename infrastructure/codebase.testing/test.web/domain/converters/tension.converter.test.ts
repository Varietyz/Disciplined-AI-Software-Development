import { describe, expect, it } from "vitest";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";
import { tensionSections } from "@banes-lab/web/domain/converters/tension.converter.ts";

describe("tensionSections", () => {
    it("renders one record per layer, the membership and every resolution", () => {
        const tensions = tensionSections(ONTOLOGY.layers);
        expect(tensions[0]?.subsections).toHaveLength(ONTOLOGY.layers.nodes.length);
        expect(tensions[2]?.subsections).toHaveLength(ONTOLOGY.layers.resolutions.length);
    });
});
