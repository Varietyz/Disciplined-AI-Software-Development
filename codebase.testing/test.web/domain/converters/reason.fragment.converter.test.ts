import { describe, expect, it } from "vitest";
import {
    lensSection,
    mathSection,
    reasonRecord,
    surfaceSection,
} from "@banes-lab/web/domain/converters/reason.fragment.converter.ts";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";

const { reason, resolution } = ONTOLOGY;

describe("surfaceSection, lensSection and mathSection", () => {
    it("renders one subsection per test surface, per lens and per math type and domain", () => {
        expect(surfaceSection(reason, resolution).subsections).toHaveLength(reason.testSurfaces.length);
        expect(lensSection(reason, resolution).subsections).toHaveLength(reason.lenses.length);
        expect(mathSection(reason, resolution).subsections).toHaveLength(
            reason.mathTypes.length + reason.mathDomains.length,
        );
    });
});

describe("reasonRecord", () => {
    it("anchors a reasoning record under the reasoning prefix and closes it with its check", () => {
        const [surface] = reason.testSurfaces;
        if (surface === undefined) {
            throw new Error("the ontology carries no test surface");
        }
        const record = reasonRecord(surface.anchor, surface.id, [], resolution);
        expect(record.id?.endsWith(surface.anchor)).toBe(true);
        expect(record.title).toBe(surface.id);
        expect(record.blocks?.length).toBeGreaterThan(0);
    });
});
