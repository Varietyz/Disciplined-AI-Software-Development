import { expect, test } from "vitest";
import { compareText } from "@govlab/quality/core/comparators/text.comparator.ts";

test("compareText orders by code point, so upper case sorts before lower case", () => {
    expect(compareText("A", "a")).toBeLessThan(0);
    expect(compareText("a", "A")).toBeGreaterThan(0);
    expect(compareText("a", "b")).toBeLessThan(0);
});

test("compareText reports equality as zero and a prefix as shorter", () => {
    expect(compareText("same", "same")).toBe(0);
    expect(compareText("", "")).toBe(0);
    expect(compareText("sort", "sorted")).toBeLessThan(0);
    expect(compareText("sorted", "sort")).toBeGreaterThan(0);
});

test("compareText sorts a list the same way the plain comparison operator would", () => {
    const names = ["Zeta", "alpha", "Beta", "_underscore", "beta2", "beta10"];
    const byCompare = [...names].sort(compareText);
    const byOperator = [...names].sort((a, b) => (a === b ? 0 : (a > b ? 1 : -1)));
    expect(byCompare).toStrictEqual(byOperator);
});
