import { describe, expect, it } from "vitest";
import { validConcepts } from "@govlab/quality/core/selectors/concept.selector.ts";

describe("validConcepts", () => {
    it("returns a non-empty canonical concept set from the bundled data", () => {
        const set = validConcepts();
        expect(set).toBeInstanceOf(Set);
        expect(set.size).toBeGreaterThan(0);
        expect(set.has("cyclomatic-complexity")).toBe(true);
    });
});
