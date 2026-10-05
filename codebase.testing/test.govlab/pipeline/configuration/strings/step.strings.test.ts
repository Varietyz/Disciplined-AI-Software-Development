import {
    STAGE_LABELS,
    STEP_LABELS,
    delegatedLabel,
    htmlhintLabel,
    lintLabel,
    removeCommentsLabel,
    stylelintLabel,
    typecheckLabel,
} from "@govlab/pipeline/configuration/strings/step.strings.ts";
import { describe, expect, it } from "vitest";

describe("step strings", () => {
    it("give every stage and step a distinct label", () => {
        const stages = Object.values(STAGE_LABELS);
        const steps = Object.values(STEP_LABELS);
        expect(new Set(stages).size).toBe(stages.length);
        expect(new Set(steps).size).toBe(steps.length);
    });

    it("name the member a per-member step runs over", () => {
        const member = "govlab.stats";
        expect(typecheckLabel(member)).toBe(`Typecheck ${member}`);
        expect(removeCommentsLabel(member)).toBe(`Remove comments ${member}`);
        expect(lintLabel(member)).toBe(`Lint ${member}`);
        expect(htmlhintLabel(member)).toBe(`HTMLHint ${member}`);
        expect(stylelintLabel(member)).toBe(`Stylelint ${member}`);
        expect(delegatedLabel("Test", "banes-lab.coordination")).toBe("Test banes-lab.coordination");
    });
});
