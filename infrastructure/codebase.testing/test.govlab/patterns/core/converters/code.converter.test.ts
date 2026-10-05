import { describe, expect, it } from "vitest";
import { bodyHash } from "@govlab/patterns/core/converters/code.converter.ts";

describe("bodyHash", () => {
    it("hashes bodies equal under whitespace alike and different bodies apart", () => {
        expect(bodyHash("a  b\n\tc")).toBe(bodyHash("a b c"));
        expect(bodyHash("  a b")).toBe(bodyHash("a b"));
        expect(bodyHash("a b")).not.toBe(bodyHash("a c"));
    });
});
