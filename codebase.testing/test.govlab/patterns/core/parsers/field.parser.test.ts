import { describe, expect, it } from "vitest";
import { numberTokenIsFloat, scanFloatFields } from "@govlab/patterns/core/parsers/field.parser.ts";

const DEPTH_JSONL = 1;
const DEPTH_ARRAY = 2;
const DEPTH_OBJECT = 3;

describe("scanFloatFields", () => {
    it("marks a field whose raw token has a decimal point, one record per line", () => {
        const floats = scanFloatFields('{"x": 1.0, "y": 2}\n{"x": 3.5, "y": 4}', DEPTH_JSONL);
        expect([...floats]).toStrictEqual(["x"]);
    });

    it("recovers floats from a JSON array and from an object of arrays", () => {
        expect([...scanFloatFields('[{"x": 1.0, "y": 2}]', DEPTH_ARRAY)]).toStrictEqual(["x"]);
        expect([...scanFloatFields('{"rows": [{"x": 1.0, "y": 2}]}', DEPTH_OBJECT)]).toStrictEqual(["x"]);
    });

    it("skips a quoted value that only looks numeric", () => {
        expect(scanFloatFields('{"x": "1.0"}', DEPTH_JSONL).size).toBe(0);
    });
});

describe("numberTokenIsFloat", () => {
    it("recognizes decimals and exponents", () => {
        expect(numberTokenIsFloat("1.0")).toBe(true);
        expect(numberTokenIsFloat("2e3")).toBe(true);
        expect(numberTokenIsFloat("42")).toBe(false);
    });
});
