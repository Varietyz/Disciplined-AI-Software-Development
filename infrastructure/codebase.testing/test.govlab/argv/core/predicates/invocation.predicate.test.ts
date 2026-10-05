import {
    FLAG_PREFIX,
    HELP_FLAG,
    HELP_FLAGS,
    SCRIPT_AT,
} from "@govlab/argv/configuration/constants/invocation.constants.ts";
import { describe, expect, it } from "vitest";
import { isMainModule } from "@govlab/argv";

describe("isMainModule", () => {
    it("is false for a module that is not the running script", () => {
        expect(SCRIPT_AT).toBe(1);
        expect(isMainModule(import.meta.url)).toBe(false);
    });
});

describe("the help flags", () => {
    it("include the long form, and every one starts with the flag prefix", () => {
        expect(HELP_FLAGS.has(HELP_FLAG)).toBe(true);
        expect([...HELP_FLAGS].every((flag) => flag.startsWith(FLAG_PREFIX))).toBe(true);
    });
});
