import {
    DataLoadError,
    isBlank,
    kindOf,
    primitiveOf,
    resolvePrimitive,
} from "@govlab/patterns/core/classifiers/schema.classifier.ts";
import { describe, expect, it } from "vitest";

const FLOAT = 1.5;
const BOOLEAN_VALUE = true;

describe("the schema classifier", () => {
    it("kindOf tells lists, lists of objects, objects and scalars apart", () => {
        expect(kindOf([1])).toBe("list");
        expect(kindOf([{ a: 1 }])).toBe("list-of-objects");
        expect(kindOf({ a: 1 })).toBe("object");
        expect(kindOf("x")).toBe("scalar");
        expect(() => kindOf(() => 1)).toThrow(DataLoadError);
    });

    it("primitiveOf reads a float hint and a fractional number as float", () => {
        expect(primitiveOf(1, true)).toBe("float");
        expect(primitiveOf(FLOAT, false)).toBe("float");
        expect(primitiveOf(1, false)).toBe("integer");
        expect(primitiveOf(BOOLEAN_VALUE, false)).toBe("boolean");
    });

    it("resolvePrimitive widens integer and float to float and refuses a real mix", () => {
        expect(resolvePrimitive("n", new Set(["integer", "float"]))).toBe("float");
        expect(resolvePrimitive("s", new Set(["string"]))).toBe("string");
        expect(() => resolvePrimitive("m", new Set(["string", "boolean"]))).toThrow(DataLoadError);
    });

    it("isBlank treats null and undefined as absent", () => {
        expect(isBlank(null)).toBe(true);
        const record: Record<string, unknown> = {};
        expect(isBlank(record["missing"])).toBe(true);
        expect(isBlank(0)).toBe(false);
    });
});
