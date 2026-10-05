import { CoordinateError, coordinate } from "@govlab/patterns/core/factories/axis.factory.ts";
import { describe, expect, it } from "vitest";
import { REPRESENTATION_AXIS } from "@govlab/patterns/configuration/generated/axis.generated.ts";
import { unknownTag } from "@govlab/patterns/configuration/strings/axis.strings.ts";

const INPUT = { analysis: "frequency", ontology: "probability", reasoning: "explanation", representation: "symbolic" };

describe("coordinate", () => {
    it("stamps all four axes and freezes the result", () => {
        const stamped = coordinate(INPUT);
        expect(stamped).toStrictEqual(INPUT);
        expect(Object.isFrozen(stamped)).toBe(true);
    });

    it("accepts every representation the ontology declares", () => {
        for (const representation of REPRESENTATION_AXIS) {
            expect(coordinate({ ...INPUT, representation }).representation).toBe(representation);
        }
    });

    it("refuses an off-vocabulary tag on any axis with a CoordinateError", () => {
        expect(() => coordinate({ ...INPUT, ontology: "nonsense" })).toThrow(CoordinateError);
        expect(() => coordinate({ ...INPUT, analysis: "nonsense" })).toThrow(CoordinateError);
        expect(() => coordinate({ ...INPUT, reasoning: "guessing" })).toThrow(CoordinateError);
        expect(() => coordinate({ ...INPUT, representation: "graphical" })).toThrow(
            unknownTag("representation", "graphical"),
        );
    });
});
