import { describe, expect, it } from "vitest";
import { isRecord } from "@govlab/patterns/core/predicates/record.predicate.ts";

describe("isRecord", () => {
    it("accepts a plain object and refuses arrays, null and scalars", () => {
        expect(isRecord({ a: 1 })).toBe(true);
        expect(isRecord([])).toBe(false);
        expect(isRecord(null)).toBe(false);
        expect(isRecord("text")).toBe(false);
    });
});
