import { describe, expect, it } from "vitest";
import { parseTrivyOutput } from "@govlab/quality/core/parsers/tool.trivy.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED =
    '{"ArtifactName":"govlab-governance/polyglot/iac","Results":[{"Misconfigurations":[' +
    '{"CauseMetadata":{"StartLine":8},"ID":"AWS-0107","Severity":"HIGH","Title":"Security groups should not allow unrestricted ingress to SSH or RDP from any IP address."},' +
    '{"CauseMetadata":{"StartLine":1},"ID":"AWS-0099","Severity":"LOW","Title":"Missing description for security group."}' +
    '],"Target":"main.tf"}]}';

const MISSING_LINE = '{"Results":[{"Misconfigurations":[{"ID":"AWS-0001","Severity":"MEDIUM"}],"Target":"x.tf"}]}';

describe("parseTrivyOutput", () => {
    it("maps every misconfiguration to an ADVISORY finding (advisory:true, never gates)", () => {
        const findings = parseTrivyOutput(RECORDED, "iac");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => finding.advisory)).toBe(true);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 1,
            ecosystem: "iac",
            file: "main.tf",
            line: 8,
            ruleId: "AWS-0107",
            severity: "error",
            tool: "trivy",
        });
        expect(findings[1]).toMatchObject({ advisory: true, line: 1, ruleId: "AWS-0099", severity: "error" });
    });

    it("falls back to POSITION when CauseMetadata/StartLine is missing", () => {
        const findings = parseTrivyOutput(MISSING_LINE, "iac");
        expect(findings[0]).toMatchObject({ column: 1, line: 1, ruleId: "AWS-0001", severity: "error" });
    });

    it("returns [] on empty, no-Results, or non-JSON output", () => {
        expect(parseTrivyOutput("", "iac")).toEqual([]);
        expect(parseTrivyOutput("{}", "iac")).toEqual([]);
        expect(parseTrivyOutput("not json", "iac")).toEqual([]);
    });
});
