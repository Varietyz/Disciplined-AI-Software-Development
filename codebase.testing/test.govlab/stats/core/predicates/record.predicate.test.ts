import { describe, expect, it } from "vitest";
import { isRecord } from "@govlab/stats/core/predicates/record.predicate.ts";

describe("isRecord", () => {
    it("accepts a plain object and refuses null, an array and a primitive", () => {
        expect(isRecord({})).toBe(true);
        expect(isRecord([])).toBe(false);
        expect(isRecord(null)).toBe(false);
        expect(isRecord("text")).toBe(false);
    });
});
