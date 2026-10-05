import { describe, expect, it } from "vitest";
import { loopSection, modelSection, substrateSection } from "@banes-lab/web/domain/converters/loop.converter.ts";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";

const { reason, resolution } = ONTOLOGY;

describe("loopSection, substrateSection and modelSection", () => {
    it("renders one subsection per stage plus the loop, per substrate node and per model", () => {
        const loop = loopSection(reason, resolution);
        expect(loop.subsections).toHaveLength(reason.derivationLoop.stages.length + 1);
        expect(loop.subsections[0]?.id?.startsWith("stage-")).toBe(true);
        expect(substrateSection(reason, resolution).subsections).toHaveLength(reason.substrate.nodes.length);
        expect(modelSection(reason, resolution).subsections).toHaveLength(reason.models.length);
    });
});
