import { describe, expect, it } from "vitest";
import { parsePhpcsOutput } from "@govlab/quality/core/parsers/tool.phpcs.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED =
    '{"files":{"bad.php":{"errors":2,"messages":[' +
    '{"column":31,"fixable":true,"line":2,"message":"Opening brace should be on a new line","severity":5,"source":"Squiz.Functions.MultiLineFunctionDeclaration.BraceOnSameLine","type":"ERROR"},' +
    '{"column":1,"fixable":true,"line":1,"message":"Expected 1 blank line after the file header; 0 found","severity":5,"source":"PSR12.Files.FileHeader.SpacingAfterTagBlock","type":"ERROR"}' +
    '],"warnings":0}},"totals":{"errors":2,"fixable":2,"warnings":0}}';

describe("parsePhpcsOutput", () => {
    it("maps messages (from the path-keyed files object) to gating Findings keyed by sniff source", () => {
        const findings = parsePhpcsOutput(RECORDED, "php");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 31,
            ecosystem: "php",
            file: "bad.php",
            fixable: true,
            line: 2,
            ruleId: "Squiz.Functions.MultiLineFunctionDeclaration.BraceOnSameLine",
            severity: "error",
            tool: "phpcs",
        });
    });

    it("returns [] on empty, no-files, or non-JSON output", () => {
        expect(parsePhpcsOutput("", "php")).toEqual([]);
        expect(parsePhpcsOutput("{}", "php")).toEqual([]);
        expect(parsePhpcsOutput("not json", "php")).toEqual([]);
    });
});
