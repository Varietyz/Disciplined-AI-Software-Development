import { describe, expect, it } from "vitest";
import { parseLintrOutput } from "@govlab/quality/core/parsers/tool.lintr.parser.ts";

const EXPECTED_COUNT = 2;

const DELIM = "~|~";
const RECORDED = [
    ["/mnt/d/…/Bad.R", "1", "3", "style", "assignment_linter", "Use one of <-, <<- for assignment, not =."].join(DELIM),
    ["/mnt/d/…/Bad.R", "3", "4", "warning", "object_usage_linter", `no visible binding for '~|~x'`].join(DELIM),
    "",
].join("\n");

describe("parseLintrOutput", () => {
    it("maps each record to an advisory (advisory:true) finding keyed by linter, type→severity, tail re-joined", () => {
        const findings = parseLintrOutput(RECORDED, "r");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 3,
            ecosystem: "r",
            file: "/mnt/d/…/Bad.R",
            line: 1,
            message: "Use one of <-, <<- for assignment, not =.",
            ruleId: "assignment_linter",
            severity: "error",
            tool: "lintr",
        });
        expect(findings[1]).toMatchObject({
            advisory: true,
            line: 3,
            message: "no visible binding for '~|~x'",
            ruleId: "object_usage_linter",
        });
    });

    it("returns [] on empty output or lines with too few fields", () => {
        expect(parseLintrOutput("", "r")).toEqual([]);
        expect(parseLintrOutput("some banner without the delimiter", "r")).toEqual([]);
        expect(parseLintrOutput("a~|~b~|~c", "r")).toEqual([]);
    });
});
