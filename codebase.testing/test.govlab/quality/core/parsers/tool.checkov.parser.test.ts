import { describe, expect, it } from "vitest";
import { parseCheckovOutput } from "@govlab/quality/core/parsers/tool.checkov.parser.ts";

const EXPECTED_COUNT = 2;
const RANGE_END = 10;

const RECORDED = JSON.stringify([
    {
        check_type: "terraform",
        results: {
            failed_checks: [
                {
                    check_id: "CKV_AWS_24",
                    check_name: "Ensure no security groups allow ingress from 0.0.0.0:0 to port 22",
                    file_line_range: [1, RANGE_END],
                    file_path: "\\main.tf",
                    severity: null,
                },
                {
                    check_id: "CKV_AWS_260",
                    check_name: "Ensure no security groups allow ingress from 0.0.0.0:0 to port 80",
                    file_line_range: [1, RANGE_END],
                    file_path: "\\main.tf",
                    severity: "HIGH",
                },
            ],
        },
    },
]);

describe("parseCheckovOutput", () => {
    it("aggregates failed_checks across blocks into ADVISORY findings (advisory:true), stripping the leading separator", () => {
        const findings = parseCheckovOutput(RECORDED, "iac");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => finding.advisory)).toBe(true);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 1,
            ecosystem: "iac",
            file: "main.tf",
            line: 1,
            ruleId: "CKV_AWS_24",
            severity: "error",
            tool: "checkov",
        });
        expect(findings[1]).toMatchObject({ advisory: true, ruleId: "CKV_AWS_260", severity: "error" });
    });

    it("returns [] on empty, no-failed-checks, or non-JSON output", () => {
        expect(parseCheckovOutput("", "iac")).toEqual([]);
        expect(
            parseCheckovOutput(JSON.stringify([{ check_type: "terraform", results: { failed_checks: [] } }]), "iac"),
        ).toEqual([]);
        expect(parseCheckovOutput("not json", "iac")).toEqual([]);
    });
});
