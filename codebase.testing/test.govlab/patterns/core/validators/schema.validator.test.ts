import { describe, expect, it } from "vitest";
import { validateMapping, validateRecord } from "@govlab/patterns/core/validators/schema.validator.ts";
import { DataLoadError } from "@govlab/patterns/core/classifiers/schema.classifier.ts";
import { detectSchema } from "@govlab/patterns/core/analyzers/schema.analyzer.ts";

const schema = detectSchema([{ color: "red" }]);

describe("validateRecord", () => {
    it("returns a record that matches the schema", () => {
        expect(validateRecord({ color: "blue" }, schema)).toStrictEqual({ color: "blue" });
    });

    it("refuses an unknown field, a wrong kind and a non-object record", () => {
        expect(() => validateRecord({ color: "red", extra: 1 }, schema)).toThrow(DataLoadError);
        expect(() => validateRecord({ color: [0, 1] }, schema)).toThrow(DataLoadError);
        expect(() => validateRecord("nope", schema)).toThrow(DataLoadError);
    });
});

describe("validateMapping", () => {
    it("refuses a mapping over a field the schema does not hold", () => {
        expect(() => {
            validateMapping(new Map([["missing", ["distribution"]]]), schema);
        }).toThrow(DataLoadError);
    });
});
