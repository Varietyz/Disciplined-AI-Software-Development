import { describe, expect, it } from "vitest";
import { MATH_TYPES } from "@govlab/patterns/configuration/constants/math.constants.ts";
import { MATH_TYPE_AXIS } from "@govlab/patterns/configuration/generated/axis.generated.ts";
import { isMathType } from "@govlab/patterns/core/predicates/math.predicate.ts";

describe("isMathType", () => {
    it("accepts exactly the math types the ontology declares", () => {
        expect([...MATH_TYPES]).toStrictEqual([...MATH_TYPE_AXIS]);
        expect(MATH_TYPE_AXIS.every((id) => isMathType(id))).toBe(true);
        expect(isMathType("numerology")).toBe(false);
    });
});
