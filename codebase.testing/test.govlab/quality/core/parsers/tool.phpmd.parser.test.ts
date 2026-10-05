import { describe, expect, it } from "vitest";
import { parsePhpmdOutput } from "@govlab/quality/core/parsers/tool.phpmd.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify({
    files: [
        {
            file: "app.php",
            violations: [
                {
                    beginLine: 5,
                    description: "The function classify has 11 parameters. Consider reducing the number of parameters.",
                    endLine: 8,
                    priority: 3,
                    rule: "ExcessiveParameterList",
                    ruleSet: "Code Size Rules",
                },
                {
                    beginLine: 7,
                    description: "Avoid unused local variables such as '$tmp'.",
                    endLine: 7,
                    priority: 3,
                    rule: "UnusedLocalVariable",
                    ruleSet: "Unused Code Rules",
                },
            ],
        },
    ],
    version: "2.15.0",
});

describe("parsePhpmdOutput", () => {
    it("maps violations to gating (error, advisory:false) Findings", () => {
        const findings = parsePhpmdOutput(RECORDED, "php");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            ecosystem: "php",
            file: "app.php",
            line: 5,
            ruleId: "ExcessiveParameterList",
            severity: "error",
            tool: "phpmd",
        });
        expect(findings[1]).toMatchObject({ line: 7, ruleId: "UnusedLocalVariable" });
    });

    it("returns [] on empty, no-files, or non-JSON output", () => {
        expect(parsePhpmdOutput("", "php")).toEqual([]);
        expect(parsePhpmdOutput("{}", "php")).toEqual([]);
        expect(parsePhpmdOutput("not json", "php")).toEqual([]);
    });
});
