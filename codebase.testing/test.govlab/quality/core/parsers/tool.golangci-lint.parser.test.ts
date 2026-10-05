import { describe, expect, it } from "vitest";
import { parseGolangciOutput } from "@govlab/quality/core/parsers/tool.golangci-lint.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED =
    '{"Issues":[' +
    '{"FromLinter":"nestif","Pos":{"Column":2,"Filename":"main.go","Line":6},"Severity":"","Text":"`if a > 0` has complex nested blocks (complexity: 6)"},' +
    '{"FromLinter":"funlen","Pos":{"Column":1,"Filename":"main.go","Line":5},"Severity":"","Text":"Function \'classify\' is too long (25 > 20)"}' +
    "]}";

describe("parseGolangciOutput", () => {
    it("maps golangci Issues to advisory:false Findings", () => {
        const findings = parseGolangciOutput(RECORDED, "go");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 2,
            ecosystem: "go",
            file: "main.go",
            line: 6,
            ruleId: "nestif",
            severity: "error",
            tool: "golangci-lint",
        });
        expect(findings[1]).toMatchObject({ column: 1, line: 5, ruleId: "funlen" });
    });

    it("returns [] on empty, no-Issues, or non-JSON output", () => {
        expect(parseGolangciOutput("", "go")).toEqual([]);
        expect(parseGolangciOutput("{}", "go")).toEqual([]);
        expect(parseGolangciOutput("not json", "go")).toEqual([]);
    });
});
