import { describe, expect, it } from "vitest";
import { parseRubocopOutput } from "@govlab/quality/core/parsers/tool.rubocop.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify({
    files: [
        {
            offenses: [
                {
                    cop_name: "Metrics/CyclomaticComplexity",
                    correctable: false,
                    corrected: false,
                    location: { start_column: 1, start_line: 4 },
                    message: "Cyclomatic complexity for classify is too high. [14/12]",
                    severity: "convention",
                },
                {
                    cop_name: "Layout/TrailingWhitespace",
                    correctable: true,
                    corrected: false,
                    location: { start_column: 20, start_line: 6 },
                    message: "Trailing whitespace detected.",
                    severity: "convention",
                },
                {
                    cop_name: "Style/FrozenStringLiteralComment",
                    correctable: true,
                    corrected: true,
                    location: { start_column: 1, start_line: 1 },
                    message: "Missing frozen string literal comment.",
                    severity: "convention",
                },
            ],
            path: "app.rb",
        },
    ],
    metadata: { rubocop_version: "1.88.1" },
    summary: { offense_count: 3, target_file_count: 1 },
});

describe("parseRubocopOutput", () => {
    it("maps non-corrected offenses to gating (error, advisory:false) Findings", () => {
        const findings = parseRubocopOutput(RECORDED, "ruby");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 1,
            ecosystem: "ruby",
            file: "app.rb",
            fixable: false,
            line: 4,
            ruleId: "Metrics/CyclomaticComplexity",
            severity: "error",
            tool: "rubocop",
        });
        expect(findings[1]).toMatchObject({ column: 20, fixable: true, line: 6, ruleId: "Layout/TrailingWhitespace" });
    });

    it("drops already-corrected offenses (they are resolved, not findings)", () => {
        const findings = parseRubocopOutput(RECORDED, "ruby");
        expect(findings.some((finding) => finding.ruleId === "Style/FrozenStringLiteralComment")).toBe(false);
    });

    it("returns [] on empty, no-files, or non-JSON output", () => {
        expect(parseRubocopOutput("", "ruby")).toEqual([]);
        expect(parseRubocopOutput("{}", "ruby")).toEqual([]);
        expect(parseRubocopOutput("not json", "ruby")).toEqual([]);
    });
});
