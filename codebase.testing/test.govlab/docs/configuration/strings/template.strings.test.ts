import {
    alreadyExists,
    brokenName,
    concernHint,
    created,
    memberHint,
    notActivity,
    placeholderSummary,
    unknownForm,
    unplaceable,
} from "@govlab/docs/configuration/strings/template.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the template strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [unknownForm("memo", "guide, reference"), 'unknown form "memo". Valid forms: guide, reference'],
                [notActivity("guide", "quality", "scaling"), 'concern "quality" must be an activity (scaling)'],
                [brokenName("x", "detail"), 'name "x" breaks'],
                [unplaceable("unknown-member", "ghost", " hint"), "unknown-member: ghost. hint"],
                [concernHint("quality, scaling"), "Valid concerns: quality, scaling."],
                [memberHint("govlab, web"), "<one of: govlab, web>"],
                [alreadyExists("a.md"), "already exists: a.md"],
                [created("a.md"), "created a.md"],
                [placeholderSummary("scale-x"), "summary of scale-x"],
            ]),
        ).toStrictEqual([]);
    });
});
