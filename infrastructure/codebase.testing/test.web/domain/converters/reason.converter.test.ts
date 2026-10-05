import { describe, expect, it } from "vitest";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";
import { spineSections } from "@banes-lab/web/domain/converters/reason.converter.ts";

describe("spineSections", () => {
    it("renders the loop, the substrate, the layers, the axes and the nodes", () => {
        const spine = spineSections(ONTOLOGY.reason, ONTOLOGY.resolution);
        expect(spine.map((section) => section.blocks?.[0]?.kind)).toStrictEqual([
            "mermaid",
            "mermaid",
            undefined,
            undefined,
            undefined,
        ]);
        expect(spine[3]?.subsections).toHaveLength(ONTOLOGY.reason.axes.length);
        expect(spine[4]?.subsections).toHaveLength(ONTOLOGY.reason.nodes.length);
    });
});
