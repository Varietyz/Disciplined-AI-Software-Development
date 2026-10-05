import { describe, expect, it } from "vitest";
import { OFF_SEVERITY } from "@govlab/stats/configuration/constants/rule.constants.ts";
import { isOff } from "@govlab/stats/core/predicates/rule.predicate.ts";

describe("isOff", () => {
    it("reads a rule as off from null, false, the off word, zero or an off tuple", () => {
        for (const value of [null, false, OFF_SEVERITY, 0, [OFF_SEVERITY, {}]]) {
            expect(isOff(value)).toBe(true);
        }
        expect(isOff("error")).toBe(false);
        expect(isOff(["error", {}])).toBe(false);
    });
});
