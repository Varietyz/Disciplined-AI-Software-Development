import { ARGV_OFFSET, EXIT_CLEAN, EXIT_REFUSED } from "@govlab/argv/configuration/constants/invocation.constants.ts";
import { ArgvRefusedError, argvOf, resolveArgv } from "@govlab/argv";
import { HELP_UNANSWERED, refusedLine } from "@govlab/argv/configuration/strings/invocation.strings.ts";
import { describe, expect, it } from "vitest";
import { SPEC } from "../converters/invocation.fixture.ts";

describe("argvOf", () => {
    it("throws the refusal instead of exiting", () => {
        expect(() => argvOf(SPEC, ["in", "--bogus"])).toThrow(ArgvRefusedError);
    });

    it("refuses a help request, which a programmatic caller cannot answer", () => {
        expect(() => argvOf(SPEC, ["--help"])).toThrow(HELP_UNANSWERED);
    });
});

describe("resolveArgv", () => {
    it("returns the parsed view for an explicit word list", () => {
        expect(resolveArgv(SPEC, ["in"]).positionals).toStrictEqual(["in"]);
    });

    it("skips the runtime and script words, and exits clean on help and non-zero on refusal", () => {
        expect(ARGV_OFFSET).toBe(2);
        expect(EXIT_CLEAN).toBe(0);
        expect(EXIT_REFUSED).not.toBe(EXIT_CLEAN);
    });

    it("prints the reason ahead of the usage on refusal", () => {
        expect(refusedLine("why", "usage")).toContain("why\n\nusage");
    });
});
