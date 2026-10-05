import { describe, expect, it } from "vitest";
import {
    isAnalysisTag,
    isOntologyTag,
    isReasoningRung,
    isRepresentationTag,
} from "@govlab/patterns/core/predicates/axis.predicate.ts";

describe("the axis predicates", () => {
    it("accept a declared tag on each axis", () => {
        expect(isOntologyTag("probability")).toBe(true);
        expect(isAnalysisTag("frequency")).toBe(true);
        expect(isRepresentationTag("symbolic")).toBe(true);
        expect(isReasoningRung("explanation")).toBe(true);
    });

    it("refuse a tag the axis does not declare", () => {
        expect(isOntologyTag("frequency-ish")).toBe(false);
        expect(isAnalysisTag("probability-ish")).toBe(false);
        expect(isRepresentationTag("graphical")).toBe(false);
        expect(isReasoningRung("guessing")).toBe(false);
    });
});
