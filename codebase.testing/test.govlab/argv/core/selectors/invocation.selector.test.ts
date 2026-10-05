import { FULL_WORDS, SPEC } from "../converters/invocation.fixture.ts";
import { argvOf, flagValue, flagValues, hasFlag, numberFlag } from "@govlab/argv";
import { describe, expect, it } from "vitest";
import { DECIMAL } from "@govlab/argv/configuration/constants/invocation.constants.ts";

describe("the flag selectors", () => {
    const argv = argvOf(SPEC, FULL_WORDS);

    it("hasFlag sees a switch", () => {
        expect(hasFlag(argv, "--loud")).toBe(true);
        expect(hasFlag(argv, "--quiet")).toBe(false);
    });

    it("flagValue takes the first value and flagValues every value", () => {
        expect(flagValue(argv, "--name")).toBe("x");
        expect(flagValues(argv, "--tag")).toStrictEqual(["a", "b"]);
        expect(flagValues(argv, "--quiet")).toStrictEqual([]);
    });

    it("numberFlag reads a base-ten value and falls back on a missing or non-numeric one", () => {
        expect(DECIMAL).toBe(10);
        expect(numberFlag(argv, "--name", 7)).toBe(7);
        expect(numberFlag(argvOf(SPEC, ["in", "--name", "012"]), "--name", 7)).toBe(12);
    });
});
