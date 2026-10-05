import {
    barePathFix,
    brokenPathText,
    deadScriptPath,
    deadScriptsFailure,
    findingLine,
    fixSummary,
    fixedDocument,
    pathCollision,
    scriptSummary,
    strictFailure,
    tallyPart,
    unlabeledFenceFix,
    validateSummary,
} from "@govlab/docs/configuration/strings/finding.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the finding strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [barePathFix("a/b.ts"), "`a/b.ts`"],
                [unlabeledFenceFix("ts"), "a ts fence"],
                [findingLine("a.md", 2, 3, "spine", "text"), "a.md:2:3 [spine] text"],
                [brokenPathText("gone.md"), '"gone.md" does not exist'],
                [pathCollision("x.md", 2, "a, b"), "2 documents route here: a, b"],
                [deadScriptPath("pkg", "build", "x.ts"), 'script "build" runs "x.ts"'],
                [scriptSummary(1, 4), "1 dead path(s) across 4"],
                [fixedDocument("a.md"), "a.md"],
                [fixSummary(3), "3 document(s)"],
                [deadScriptsFailure(2), "2 dead"],
                [strictFailure(5), "5 doc finding(s)"],
                [validateSummary(9, 1, "0 spine"), "scanned 9"],
                [tallyPart(4, "spine"), "4 spine"],
            ]),
        ).toStrictEqual([]);
    });
});
