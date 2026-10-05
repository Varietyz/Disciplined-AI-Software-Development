import { describe, expect, it } from "vitest";
import type { ResolvedConcern } from "@govlab/quality/types/concern.types.ts";
import { excludedByConcept } from "@govlab/quality/core/predicates/concept.predicate.ts";

describe("excludedByConcept", () => {
    it("detects an excluded concept in a canon list", () => {
        const map = new Map<string, ResolvedConcern>([["x", { exclude: true }]]);
        expect(excludedByConcept(["x"], map)).toBe(true);
        expect(excludedByConcept(["y"], map)).toBe(false);
    });
});
