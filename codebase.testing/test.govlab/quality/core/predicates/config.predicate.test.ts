import { expect, test } from "vitest";
import { isConfigObject } from "@govlab/quality/core/predicates/config.predicate.ts";

test("isConfigObject holds for a plain object only", () => {
    expect(isConfigObject({ a: 1 })).toBe(true);
    expect(isConfigObject([1])).toBe(false);
    expect(isConfigObject(null)).toBe(false);
    expect(isConfigObject("x")).toBe(false);
});
