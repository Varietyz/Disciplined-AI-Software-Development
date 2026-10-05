import { describe, expect, it } from "vitest";
import {
    driftFinding,
    gateFinding,
    healed,
    regenerated,
    selfHealed,
    unstableRegeneration,
    workspaceMapHardening,
} from "@govlab/docs/configuration/strings/drift.strings.ts";
import { unmatched } from "./strings.fixture.ts";

describe("the drift strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [gateFinding("a.md", 3, "chart-syntax", "bad"), "a.md:3 [chart-syntax] bad"],
                [unstableRegeneration("a.md", "readme-drift", 3), "across 3 attempts"],
                [driftFinding("a.md", "readme-drift"), "a.md [readme-drift]"],
                [selfHealed("a.md"), "self-healed a.md"],
                [regenerated("a.md"), "regenerated a.md"],
                [healed("a.md"), "healed a.md"],
                [workspaceMapHardening("map.md", "paren", "detail"), "[paren] detail"],
            ]),
        ).toStrictEqual([]);
    });
});
