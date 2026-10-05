import {
    BUILD_COMMAND,
    BUILD_SUMMARY,
    NO_TARBALL,
    UNKNOWN_FAILURE,
    buildFailed,
    builtLine,
    builtSummary,
    fetchFailedLine,
    fetchFailedNote,
    noParserSource,
    noteLine,
    wasmFailedLine,
    wroteLine,
} from "@govlab/code-parse/configuration/strings/grammar.strings.ts";
import { describe, expect, it } from "vitest";

describe("the grammar build lines", () => {
    it("end each terminal line with a newline and name the language", () => {
        for (const line of [
            builtLine("go", ["go"]),
            wasmFailedLine("go", "why"),
            fetchFailedLine("go", "why"),
            noteLine("skipped", "go"),
            fetchFailedNote("go"),
            buildFailed("why"),
            wroteLine(1, "map.json"),
            builtSummary(["go"]),
        ]) {
            expect(line.endsWith("\n")).toBe(true);
        }
        expect(builtLine("go", ["go", "mod"])).toContain("go,mod");
    });

    it("name the missing parser source, or the package root when no subfolder is declared", () => {
        expect(noParserSource("php")).toContain("php");
        expect(noParserSource()).toContain("<root>");
    });

    it("carry the contract and the fixed failure texts", () => {
        expect(BUILD_COMMAND).toContain("build:grammars");
        expect(BUILD_SUMMARY.endsWith(".")).toBe(true);
        expect(new Set([NO_TARBALL, UNKNOWN_FAILURE]).size).toBe(2);
    });
});
