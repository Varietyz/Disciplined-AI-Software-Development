import { describe, expect, it } from "vitest";
import { parseTflintOutput, tflintErrorDetail } from "@govlab/quality/core/parsers/tool.tflint.parser.ts";

describe("tflintErrorDetail", () => {
    it("joins the reported error messages, and falls back to stderr then stdout", () => {
        expect(tflintErrorDetail(JSON.stringify({ errors: [{ message: "a" }, { message: "b" }] }), "")).toBe("a; b");
        expect(tflintErrorDetail("", "broke")).toBe("broke");
    });
});

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify({
    issues: [
        {
            fixable: false,
            message: "`region` variable has no type",
            range: { filename: "main.tf", start: { column: 1, line: 12 } },
            rule: { name: "terraform_typed_variables", severity: "warning" },
        },
        {
            fixable: true,
            message: "Interpolation-only expressions are deprecated",
            range: { filename: "main.tf", start: { column: 21, line: 2 } },
            rule: { name: "terraform_deprecated_interpolation", severity: "error" },
        },
    ],
});

describe("parseTflintOutput", () => {
    it("maps each issue to an ADVISORY finding (advisory:true) keyed by the nested rule name", () => {
        const findings = parseTflintOutput(RECORDED, "iac");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => finding.advisory)).toBe(true);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 1,
            ecosystem: "iac",
            file: "main.tf",
            fixable: false,
            line: 12,
            ruleId: "terraform_typed_variables",
            severity: "error",
            tool: "tflint",
        });
        expect(findings[1]).toMatchObject({
            advisory: true,
            fixable: true,
            ruleId: "terraform_deprecated_interpolation",
            severity: "error",
        });
    });

    it("returns [] on empty, no-issues, or non-JSON output", () => {
        expect(parseTflintOutput("", "iac")).toEqual([]);
        expect(parseTflintOutput(JSON.stringify({ issues: [] }), "iac")).toEqual([]);
        expect(parseTflintOutput("not json", "iac")).toEqual([]);
    });
});
