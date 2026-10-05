import { describe, expect, it } from "vitest";
import { isRepresentation } from "@govlab/patterns/core/predicates/representation.predicate.ts";

describe("isRepresentation", () => {
    it("accepts a registered representation name and refuses anything else", () => {
        expect(isRepresentation("tree")).toBe(true);
        expect(isRepresentation("unregistered")).toBe(false);
        expect(isRepresentation(1)).toBe(false);
    });
});
