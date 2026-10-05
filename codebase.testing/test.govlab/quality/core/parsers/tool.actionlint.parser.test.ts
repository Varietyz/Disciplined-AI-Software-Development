import { describe, expect, it } from "vitest";
import { parseActionlintOutput } from "@govlab/quality/core/parsers/tool.actionlint.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify([
    {
        column: 3,
        filepath: "actions/.github/workflows/bad.yml",
        kind: "job-needs",
        line: 3,
        message: 'job "build" needs job "nonexistent" which does not exist in this workflow',
    },
    {
        column: 15,
        filepath: "actions/.github/workflows/bad.yml",
        kind: "shellcheck",
        line: 7,
        message: "shellcheck reported issue in this script: SC2086:info:1:6: Double quote to prevent globbing",
    },
]);

describe("parseActionlintOutput", () => {
    it("maps each error to an ADVISORY finding (advisory:true) keyed by kind", () => {
        const findings = parseActionlintOutput(RECORDED, "actions");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => finding.advisory)).toBe(true);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 3,
            ecosystem: "actions",
            file: "actions/.github/workflows/bad.yml",
            line: 3,
            ruleId: "job-needs",
            severity: "error",
            tool: "actionlint",
        });
        expect(findings[1]).toMatchObject({ advisory: true, line: 7, ruleId: "shellcheck" });
    });

    it("returns [] on empty, empty-array, or non-JSON output", () => {
        expect(parseActionlintOutput("", "actions")).toEqual([]);
        expect(parseActionlintOutput("[]", "actions")).toEqual([]);
        expect(parseActionlintOutput("not json", "actions")).toEqual([]);
    });
});
