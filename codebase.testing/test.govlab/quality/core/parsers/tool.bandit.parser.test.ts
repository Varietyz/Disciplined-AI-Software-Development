import { describe, expect, it } from "vitest";
import { parseBanditOutput } from "@govlab/quality/core/parsers/tool.bandit.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify({
    errors: [],
    results: [
        {
            col_offset: 4,
            filename: "app.py",
            issue_severity: "HIGH",
            issue_text: "subprocess call with shell=True identified, security issue.",
            line_number: 7,
            test_id: "B602",
            test_name: "subprocess_popen_with_shell_equals_true",
        },
        {
            col_offset: 0,
            filename: "app.py",
            issue_severity: "LOW",
            issue_text: "Consider possible security implications associated with the subprocess module.",
            line_number: 1,
            test_id: "B404",
            test_name: "blacklist",
        },
    ],
});

describe("parseBanditOutput", () => {
    it("maps every result to an ADVISORY finding (advisory:true, never gates)", () => {
        const findings = parseBanditOutput(RECORDED, "python");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => finding.advisory)).toBe(true);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 5,
            ecosystem: "python",
            file: "app.py",
            line: 7,
            ruleId: "B602",
            severity: "error",
            tool: "bandit",
        });
        expect(findings[1]).toMatchObject({ advisory: true, column: 1, ruleId: "B404", severity: "error" });
    });

    it("returns [] on empty, no-results, or non-JSON output", () => {
        expect(parseBanditOutput("", "python")).toEqual([]);
        expect(parseBanditOutput("{}", "python")).toEqual([]);
        expect(parseBanditOutput("not json", "python")).toEqual([]);
    });
});
