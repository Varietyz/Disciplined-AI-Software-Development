import {
    chartsHeading,
    dataFlowTitle,
    flowTitle,
    legendLine,
    lifecycleTitle,
    moreNodes,
    orchestrationTitle,
    stateTitle,
    structureTitle,
    truncationNote,
    typeRelationshipTitle,
} from "@govlab/docs/configuration/strings/figure.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the figure strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [dataFlowTitle("mod"), "mod data flow"],
                [flowTitle("mod", "entry"), "mod flow: entry"],
                [lifecycleTitle("mod"), "mod npm-script"],
                [orchestrationTitle("mod"), "mod orchestration"],
                [stateTitle("mod"), "mod lifecycle"],
                [structureTitle("mod"), "mod structure"],
                [typeRelationshipTitle("mod"), "mod type relationships"],
                [truncationNote(10, 40), "10 of 40"],
                [moreNodes(6), "plus 6 more"],
                [chartsHeading("mod"), "# mod"],
                [legendLine(["a", "b"]), "Legend: a - b"],
            ]),
        ).toStrictEqual([]);
    });
});
