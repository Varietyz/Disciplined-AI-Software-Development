import {
    badName,
    boundaryForm,
    boundaryMisplaced,
    declaredDocFailure,
    missingConcern,
    moduleConcern,
    noConcernForm,
    notAuthored,
    offLocation,
    unknownConcern,
    unknownForm,
    unknownMember,
    unmarkedMember,
    unresolvedOwner,
} from "@govlab/docs/configuration/strings/location.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the location strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [unmarkedMember("govlab, web"), "govlab, web"],
                [unknownMember("ghost", "govlab"), 'member "ghost"'],
                [missingConcern("guide"), 'form "guide"'],
                [unknownConcern("nope"), 'concern "nope"'],
                [moduleConcern("changelog"), 'form "changelog"'],
                [unresolvedOwner("x"), 'for "x"'],
                [noConcernForm("readme"), 'form "readme"'],
                [boundaryForm("readme"), 'form "readme"'],
                [notAuthored("generated"), 'kind "generated"'],
                [badName("a/b"), 'name "a/b"'],
                [unknownForm("memo"), 'form "memo"'],
                [boundaryMisplaced("README.md", "docs/"), 'boundary doc "README.md"'],
                [offLocation("a.md", "b.md"), 'route to "b.md"'],
                [declaredDocFailure("x", "bad-name", "detail"), "documents: x → bad-name: detail"],
            ]),
        ).toStrictEqual([]);
    });
});
