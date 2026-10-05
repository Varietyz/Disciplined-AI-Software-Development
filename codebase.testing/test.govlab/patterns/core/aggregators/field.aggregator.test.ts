import { describe, expect, it } from "vitest";
import { DataLoadError } from "@govlab/patterns/core/classifiers/schema.classifier.ts";
import { FieldAccumulator } from "@govlab/patterns/core/aggregators/field.aggregator.ts";

const TWO = 2;

describe("FieldAccumulator", () => {
    it("folds observations into a nullable scalar schema", () => {
        const field = new FieldAccumulator();
        field.observe("red", false);
        field.observe(null, false);
        expect(field.result("color", TWO)).toStrictEqual({
            elementNumeric: false,
            fixedLength: null,
            kind: "scalar",
            name: "color",
            nullable: true,
            primitive: "string",
        });
    });

    it("records a fixed-length numeric list", () => {
        const field = new FieldAccumulator();
        field.observe([0, 1], false);
        field.observe([1, 1], false);
        expect(field.result("point", TWO)).toMatchObject({ elementNumeric: true, fixedLength: TWO, kind: "list" });
    });

    it("refuses a field whose values change kind", () => {
        const field = new FieldAccumulator();
        field.observe("x", false);
        field.observe([1], false);
        expect(() => field.result("mixed", TWO)).toThrow(DataLoadError);
    });
});
