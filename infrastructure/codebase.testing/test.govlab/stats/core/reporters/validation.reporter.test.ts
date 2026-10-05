import { describe, expect, it } from "vitest";
import { INPUT } from "../loaders/stats.fixture.ts";
import { verificationSubsections } from "@govlab/stats/core/reporters/validation.reporter.ts";

describe("verificationSubsections", () => {
    it("renders the gate, the enforcement and the type-check, and says so when no report was recorded", () => {
        const text = verificationSubsections(INPUT.verify, INPUT.activeRules, INPUT.typescript).join("\n");
        expect(text).toContain("### Gate");
        expect(text).toContain("### Enforcement");
        expect(text).toContain("### Type-check");
        const absent = verificationSubsections(
            { ...INPUT.verify, available: false },
            INPUT.activeRules,
            INPUT.typescript,
        );
        expect(absent.join("\n")).toContain("not recorded");
    });
});
