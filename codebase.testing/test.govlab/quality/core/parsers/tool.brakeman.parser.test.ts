import { describe, expect, it } from "vitest";
import { parseBrakemanOutput } from "@govlab/quality/core/parsers/tool.brakeman.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify({
    warnings: [
        {
            check_name: "SQL",
            confidence: "Medium",
            file: "app/controllers/users_controller.rb",
            line: 3,
            message: "Possible SQL injection",
            warning_type: "SQL Injection",
        },
        {
            check_name: "CrossSiteScripting",
            confidence: "High",
            file: "app/views/users/show.html.erb",
            line: 1,
            message: "Unescaped parameter value",
            warning_type: "Cross-Site Scripting",
        },
    ],
});

describe("parseBrakemanOutput", () => {
    it("maps every warning to an ADVISORY finding (advisory:true, never gates), keyed by check_name", () => {
        const findings = parseBrakemanOutput(RECORDED, "ruby");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => finding.advisory)).toBe(true);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 1,
            ecosystem: "ruby",
            file: "app/controllers/users_controller.rb",
            line: 3,
            ruleId: "SQL",
            severity: "error",
            tool: "brakeman",
        });
        expect(findings[1]).toMatchObject({ advisory: true, ruleId: "CrossSiteScripting", severity: "error" });
    });

    it("returns [] on a non-Rails path (non-JSON notice), empty, or no-warnings output", () => {
        expect(parseBrakemanOutput("Please supply the path to a Rails application", "ruby")).toEqual([]);
        expect(parseBrakemanOutput("", "ruby")).toEqual([]);
        expect(parseBrakemanOutput("{}", "ruby")).toEqual([]);
    });
});
