import { describe, expect, it } from "vitest";
import { asText } from "@govlab/patterns/core/converters/field.converter.ts";

describe("asText", () => {
    it("serializes objects and lists and stringifies scalars", () => {
        expect(asText({ a: 1 })).toBe('{"a":1}');
        expect(asText([1, 2])).toBe("[1,2]");
        expect(asText(1)).toBe("1");
        expect(asText(null)).toBe("null");
    });
});
