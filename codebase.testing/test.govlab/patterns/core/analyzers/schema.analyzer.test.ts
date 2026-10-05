import { describe, expect, it } from "vitest";
import { DataLoadError } from "@govlab/patterns/core/classifiers/schema.classifier.ts";
import type { FieldSchema } from "@govlab/patterns/types/schema.types.ts";
import { detectSchema } from "@govlab/patterns/core/analyzers/schema.analyzer.ts";

const LOW = 3;
const HIGH = 7;
const RATIO = 1.5;

const byName = function byName(schema: readonly FieldSchema[], name: string): FieldSchema | undefined {
    return schema.find((field) => field.name === name);
};

describe("detectSchema", () => {
    const schema = detectSchema([
        { color: "red", n: LOW, ratio: RATIO },
        { color: "blue", n: HIGH },
    ]);

    it("classifies scalar kinds and primitives", () => {
        expect(byName(schema, "color")).toMatchObject({ kind: "scalar", nullable: false, primitive: "string" });
        expect(byName(schema, "n")).toMatchObject({ kind: "scalar", primitive: "integer" });
    });

    it("marks a field absent from some records as nullable", () => {
        expect(byName(schema, "ratio")).toMatchObject({ nullable: true, primitive: "float" });
    });

    it("reads a field named in the float hint as float", () => {
        const records = [{ x: 1 }, { x: 2 }];
        const hinted = detectSchema(records, new Set(["x"]));
        const plain = detectSchema(records);
        expect(byName(hinted, "x")?.primitive).toBe("float");
        expect(byName(plain, "x")?.primitive).toBe("integer");
    });

    it("refuses a record that is not an object", () => {
        expect(() => detectSchema(["nope"])).toThrow(DataLoadError);
    });
});
