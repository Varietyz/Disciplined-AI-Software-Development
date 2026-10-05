import { describe, expect, it } from "vitest";
import { detectSchema } from "@govlab/patterns/core/analyzers/schema.analyzer.ts";
import { isCoordinatePair } from "@govlab/patterns/core/predicates/schema.predicate.ts";

describe("isCoordinatePair", () => {
    it("accepts a fixed-length numeric pair and refuses a longer list", () => {
        const [pair] = detectSchema([{ point: [0, 0] }, { point: [1, 1] }]);
        const [triple] = detectSchema([{ point: [0, 0, 0] }]);
        expect(pair !== undefined && isCoordinatePair(pair)).toBe(true);
        expect(triple !== undefined && isCoordinatePair(triple)).toBe(false);
    });
});
