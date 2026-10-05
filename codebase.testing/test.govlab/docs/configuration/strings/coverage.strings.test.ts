import {
    coverageGaps,
    coverageHeading,
    missingAiContext,
    missingCapabilities,
    rankedRow,
    withoutRelationships,
} from "@govlab/docs/configuration/strings/coverage.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the coverage strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [coverageHeading(7), "7 modules"],
                [missingCapabilities(2), "2"],
                [missingAiContext(3), "3"],
                [withoutRelationships(4), "4"],
                [rankedRow("mod", true, "no-capabilities"), "mod [private] — no-capabilities"],
                [rankedRow("mod", false, "gap"), "mod — gap"],
                [coverageGaps(5), "5 enrichment gap(s)"],
            ]),
        ).toStrictEqual([]);
    });
});
