import {
    barrelEntry,
    barrelHeading,
    barrelSection,
    catalogSummary,
} from "@govlab/docs/configuration/strings/catalog.strings.ts";
import { describe, expect, it } from "vitest";
import { goSummary, unresolvedCalls } from "@govlab/docs/configuration/strings/code.strings.ts";
import { unmatched } from "./strings.fixture.ts";

describe("the catalog and code strings", () => {
    it("carry every operand they are given", () => {
        const summary = catalogSummary({
            concerns: 2,
            cycles: 0,
            deadEdges: 1,
            docs: 9,
            healed: 3,
            pruned: 4,
            superseded: 5,
        });
        expect(
            unmatched([
                [barrelHeading("quality"), "quality"],
                [barrelSection("guide"), "## guide"],
                [barrelEntry("scale-x", "guides/x.md", "a summary", " marker"), "(../guides/x.md)"],
                [summary, "9 doc(s)"],
                [summary, "5 superseded"],
                [goSummary("mod", 3, 4), "3 funcs, 4 nodes"],
                [unresolvedCalls("mod", 2), "2 unresolved"],
            ]),
        ).toStrictEqual([]);
    });
});
