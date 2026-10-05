import { describe, expect, it } from "vitest";
import { parsePerlcriticOutput } from "@govlab/quality/core/parsers/tool.perlcritic.parser.ts";

const EXPECTED_COUNT = 2;

const DELIM = "~|~";
const RECORDED = [
    [
        "govlab-governance/polyglot/perl/Bad.pm",
        "5",
        "1",
        "3",
        "Subroutines::ProhibitManyArgs",
        "Too many arguments",
    ].join(DELIM),
    ["x.pm", "9", "5", "4", "BuiltinFunctions::ProhibitStringyEval", `String "a~|~b" in eval`].join(DELIM),
    "",
].join("\n");

describe("parsePerlcriticOutput", () => {
    it("maps each delimited record to a gating (advisory:false) finding keyed by policy, message tail re-joined", () => {
        const findings = parsePerlcriticOutput(RECORDED, "perl");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 1,
            ecosystem: "perl",
            file: "govlab-governance/polyglot/perl/Bad.pm",
            line: 5,
            message: "Too many arguments",
            ruleId: "Subroutines::ProhibitManyArgs",
            severity: "error",
            tool: "perlcritic",
        });
        expect(findings[1]).toMatchObject({
            advisory: false,
            line: 9,
            message: 'String "a~|~b" in eval',
            ruleId: "BuiltinFunctions::ProhibitStringyEval",
        });
    });

    it("returns [] on empty output or lines with too few fields", () => {
        expect(parsePerlcriticOutput("", "perl")).toEqual([]);
        expect(parsePerlcriticOutput("some non-delimited banner line", "perl")).toEqual([]);
        expect(parsePerlcriticOutput("a~|~b~|~c", "perl")).toEqual([]);
    });
});
