import { describe, expect, it } from "vitest";
import { parseStaticcheckOutput } from "@govlab/quality/core/parsers/tool.staticcheck.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = [
    JSON.stringify({
        code: "S1021",
        location: { column: 2, file: "bad.go", line: 6 },
        message: "should merge variable declaration with assignment on next line",
        severity: "error",
    }),
    JSON.stringify({
        code: "SA4006",
        location: { column: 2, file: "bad.go", line: 9 },
        message: "this value of x is never used",
        severity: "error",
    }),
].join("\n");

describe("parseStaticcheckOutput", () => {
    it("maps each streamed JSON object to an advisory (advisory:true) error finding keyed by code", () => {
        const findings = parseStaticcheckOutput(RECORDED, "go");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 2,
            ecosystem: "go",
            file: "bad.go",
            line: 6,
            ruleId: "S1021",
            severity: "error",
            tool: "staticcheck",
        });
        expect(findings[1]).toMatchObject({ advisory: true, line: 9, ruleId: "SA4006" });
    });

    it("skips blank lines and returns [] on empty or non-JSON output", () => {
        expect(parseStaticcheckOutput("", "go")).toEqual([]);
        expect(parseStaticcheckOutput("\n\n", "go")).toEqual([]);
        expect(parseStaticcheckOutput("not json", "go")).toEqual([]);
    });
});
