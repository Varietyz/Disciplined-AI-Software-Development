import { expect, test } from "vitest";
import { numericPx } from "@govlab/quality/core/converters/css.converter.ts";

test("numericPx reads a px value as is and scales rem and em by the base font size", () => {
    expect(numericPx("12px")).toBe(12);
    expect(numericPx("1.5rem")).toBe(24);
    expect(numericPx("-2em")).toBe(-32);
});

test("numericPx answers null for a token with no leading number", () => {
    expect(numericPx("auto")).toBeNull();
    expect(numericPx("-")).toBeNull();
});
