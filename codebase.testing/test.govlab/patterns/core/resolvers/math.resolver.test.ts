import { describe, expect, it } from "vitest";
import { ANALYSIS_AXIS } from "@govlab/patterns/configuration/generated/axis.generated.ts";
import { isMathType } from "@govlab/patterns/core/predicates/math.predicate.ts";
import { mathTypeOf } from "@govlab/patterns/core/resolvers/math.resolver.ts";

describe("mathTypeOf", () => {
    it("maps representative analysis tags to their math type", () => {
        expect(mathTypeOf("statistical")).toBe("probability");
        expect(mathTypeOf("relation")).toBe("graph");
        expect(mathTypeOf("time")).toBe("dynamical-systems");
        expect(mathTypeOf("structure")).toBe("algebra");
    });

    it("gives every analysis tag a declared math type, with no silent default", () => {
        expect(ANALYSIS_AXIS.every((tag) => isMathType(mathTypeOf(tag)))).toBe(true);
    });
});
