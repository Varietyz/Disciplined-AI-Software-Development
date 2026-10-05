import { axisGenerated, unknownRung, unknownTag } from "@govlab/patterns/configuration/strings/axis.strings.ts";
import { describe, expect, it } from "vitest";

describe("the axis strings", () => {
    it("name the axis and the refused value", () => {
        expect(unknownTag("ontology", "x")).toBe('unknown ontology tag "x"');
        expect(unknownRung("y")).toBe('unknown reasoning rung "y"');
    });

    it("report the generated file with its counts on one line", () => {
        expect(axisGenerated("axis.generated.ts", "ONTOLOGY_AXIS 1")).toBe(
            "generated axis.generated.ts: ONTOLOGY_AXIS 1\n",
        );
    });
});
