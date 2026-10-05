import { FULL_WORDS, SPEC } from "./invocation.fixture.ts";
import { describe, expect, it } from "vitest";
import {
    missingValue,
    repeatedFlag,
    tooFewPositionals,
    tooManyPositionals,
    undeclaredFlag,
} from "@govlab/argv/configuration/strings/invocation.strings.ts";
import { parseArgv } from "@govlab/argv";

describe("parseArgv", () => {
    it("parses declared flags and positionals", () => {
        const outcome = parseArgv(SPEC, FULL_WORDS);
        expect(outcome.kind).toBe("parsed");
        expect(outcome.kind === "parsed" ? outcome.argv.positionals : []).toStrictEqual(["in"]);
    });

    it("answers help before anything else", () => {
        expect(parseArgv(SPEC, ["--bogus", "--help"]).kind).toBe("help");
        expect(parseArgv(SPEC, ["-h"]).kind).toBe("help");
    });

    it.each([
        [["in", "--bogus"], undeclaredFlag("--bogus", SPEC.command)],
        [["in", "--name"], missingValue("--name")],
        [["in", "--name", "a", "--name", "b"], repeatedFlag("--name")],
        [[], tooFewPositionals(0, 1)],
        [["a", "b"], tooManyPositionals(2, 1, ["a", "b"])],
    ])("refuses %j with its reason", (words, reason) => {
        const outcome = parseArgv(SPEC, words);
        expect(outcome.kind === "refused" ? outcome.reason : "").toBe(reason);
    });

    it("passes the words after every positional through as rest when the contract declares one", () => {
        const outcome = parseArgv({ ...SPEC, rest: { describe: "passed on", name: "args" } }, ["in", "--bogus"]);
        expect(outcome.kind === "parsed" ? outcome.argv.rest : []).toStrictEqual(["--bogus"]);
    });
});
