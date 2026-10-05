import { describe, expect, it } from "vitest";
import {
    heterogeneousKinds,
    invalidSchemaField,
    kindMismatch,
    mixedPrimitives,
    notAnObject,
    primitiveMismatch,
    requiredField,
    unknownMappingFields,
    unknownRecordFields,
    unresolvedKind,
    unsupportedValue,
} from "@govlab/patterns/configuration/strings/schema.strings.ts";

describe("the schema strings", () => {
    it("name the field each refusal concerns", () => {
        for (const line of [
            mixedPrimitives("f", "a, b"),
            heterogeneousKinds("f", "a, b"),
            unresolvedKind("f"),
            requiredField("f"),
            kindMismatch("f", "list", "scalar"),
            primitiveMismatch("f", "string"),
        ]) {
            expect(line).toContain('"f"');
        }
    });

    it("carry the offending value or names", () => {
        expect(unsupportedValue("function")).toBe("unsupported value type: function");
        expect(notAnObject('"x"')).toContain('"x"');
        expect(unknownRecordFields("a, b")).toContain("a, b");
        expect(invalidSchemaField("{}")).toContain("{}");
        expect(unknownMappingFields("m")).toContain("m");
    });
});
