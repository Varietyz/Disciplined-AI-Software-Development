import { expect, test } from "vitest";
import { parseOxlintOutput } from "@govlab/quality/core/parsers/tool.oxlint.parser.ts";

test("parseOxlintOutput maps oxlint diagnostics into findings and yields none for empty output", () => {
    expect(parseOxlintOutput("", "javascript")).toEqual([]);
    const stdout = JSON.stringify({
        diagnostics: [
            {
                code: "eslint(no-debugger)",
                filename: "a.ts",
                labels: [{ span: { column: 5, line: 3 } }],
                message: "unexpected debugger",
            },
        ],
    });
    const findings = parseOxlintOutput(stdout, "javascript");
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
        column: 5,
        ecosystem: "javascript",
        file: "a.ts",
        line: 3,
        message: "unexpected debugger",
        ruleId: "eslint/no-debugger",
        tool: "oxlint",
    });
});
