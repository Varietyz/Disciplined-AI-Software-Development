import {
    booleanFieldError,
    isObject,
    isStringArray,
    requireObjectField,
    stringArrayFieldError,
    stringFieldErrors,
    validateBlockExclusions,
    validateEcosystems,
    validateOwners,
} from "@govlab/quality/core/validators/section.validator.ts";
import { expect, test } from "vitest";

test("section guards narrow values as documented", () => {
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isStringArray(["a"])).toBe(true);
    expect(isStringArray("nope")).toBe(false);
});

test("section field checks report a wrong type and pass a right one", () => {
    expect(requireObjectField({ a: 1 }, "a")).toHaveLength(1);
    expect(requireObjectField({ a: {} }, "a")).toStrictEqual([]);
    expect(stringFieldErrors({ a: 1 }, ["a"])).toHaveLength(1);
    expect(stringArrayFieldError({ a: [1] }, "a", "bad")).toStrictEqual(["bad"]);
    expect(booleanFieldError({ a: "x" }, "a", "bad")).toStrictEqual(["bad"]);
    expect(booleanFieldError({ a: true }, "a", "bad")).toStrictEqual([]);
});

test("section validators refuse unknown ecosystems, non-string owners and incomplete block exclusions", () => {
    expect(validateEcosystems(["typescript"])).toStrictEqual([]);
    expect(validateEcosystems(["cobol"])).toHaveLength(1);
    expect(validateEcosystems("typescript")).toHaveLength(1);
    expect(validateOwners({ lint: { python: "ruff" } })).toStrictEqual([]);
    expect(validateOwners({ lint: { python: 1 } })).toHaveLength(1);
    expect(validateBlockExclusions([])).toStrictEqual([]);
    expect(validateBlockExclusions([{ file: "a.ts", functions: ["f"], rule: "r" }])).toStrictEqual([]);
    expect(validateBlockExclusions([{ file: "a.ts", functions: [], rule: "r" }])).toHaveLength(1);
    expect(validateBlockExclusions("nope")).toHaveLength(1);
});
