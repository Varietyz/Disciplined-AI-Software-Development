import { expect, test } from "vitest";
import { parseYamllintOutput } from "@govlab/quality/core/parsers/tool.yamllint.parser.ts";

const COLUMN = 5;

test("parseYamllintOutput reads the parsable format and keeps the rule id from the trailing parentheses", () => {
    const output = "a.yml:2:5: [error] trailing spaces (trailing-spaces)\nnoise\n";
    const findings = parseYamllintOutput(output, "yaml");
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
        column: COLUMN,
        file: "a.yml",
        line: 2,
        message: "trailing spaces",
        ruleId: "trailing-spaces",
        tool: "yamllint",
    });
    expect(parseYamllintOutput("a.yml:1:1: [warning] no rule id", "yaml")[0]?.ruleId).toBe("yamllint");
});
