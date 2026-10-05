import { describe, expect, it } from "vitest";
import { isThreshold } from "@govlab/quality/core/predicates/knob.predicate.ts";

describe("isThreshold", () => {
    it("detects threshold-like knob names", () => {
        expect(isThreshold("max-len")).toBe(true);
        expect(isThreshold("enabled")).toBe(false);
    });
});
