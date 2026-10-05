import { describe, expect, it } from "vitest";
import { parseShellcheckOutput } from "@govlab/quality/core/parsers/tool.shellcheck.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify([
    {
        code: 2086,
        column: 6,
        file: "deploy.sh",
        fix: { replacements: [] },
        level: "info",
        line: 5,
        message: "Double quote to prevent globbing and word splitting.",
    },
    {
        code: 2250,
        column: 1,
        file: "deploy.sh",
        fix: null,
        level: "style",
        line: 4,
        message: "Prefer putting braces around variable references even when not strictly required.",
    },
]);

describe("parseShellcheckOutput", () => {
    it("maps comments to gating (error, advisory:false) Findings with SC<code> ids", () => {
        const findings = parseShellcheckOutput(RECORDED, "shell");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 6,
            ecosystem: "shell",
            file: "deploy.sh",
            fixable: true,
            line: 5,
            ruleId: "SC2086",
            severity: "error",
            tool: "shellcheck",
        });
        expect(findings[1]).toMatchObject({ fixable: false, ruleId: "SC2250" });
    });

    it("returns [] on empty, no-comments, or non-JSON output", () => {
        expect(parseShellcheckOutput("", "shell")).toEqual([]);
        expect(parseShellcheckOutput("[]", "shell")).toEqual([]);
        expect(parseShellcheckOutput("not json", "shell")).toEqual([]);
    });
});
