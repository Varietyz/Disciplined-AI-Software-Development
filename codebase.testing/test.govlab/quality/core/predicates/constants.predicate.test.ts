import { expect, test } from "vitest";
import { isUpperSnake } from "@govlab/quality/core/predicates/constants.predicate.ts";

test("isUpperSnake holds for an upper-case snake name with at least one letter", () => {
    expect(isUpperSnake("MAX_LINES")).toBe(true);
    expect(isUpperSnake("A1")).toBe(true);
    expect(isUpperSnake("maxLines")).toBe(false);
    expect(isUpperSnake("_1")).toBe(false);
});
