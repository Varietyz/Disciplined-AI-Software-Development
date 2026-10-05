import { expect, test } from "vitest";
import { formatFindings, renderHuman, renderJson } from "@govlab/quality/core/formatters/report.formatter.ts";
import type { Finding } from "@govlab/quality/types/finding.types.ts";

const finding: Finding = {
    advisory: false,
    column: 2,
    ecosystem: "go",
    file: "a.go",
    fixable: false,
    line: 1,
    message: "A rule reported a defect.",
    ruleId: "tool/rule",
    severity: "error",
    tool: "tool",
};

test("formatFindings groups findings under their file", () => {
    expect(formatFindings([finding])).toBe("a.go\n  1:2  error  A rule reported a defect.  tool/rule (tool)");
});

test("renderHuman appends the counted summary and renderJson carries the same counts", () => {
    expect(renderHuman(["out"], [finding], 0)).toBe("out\n\n1 error(s), 0 advisory, 0 notice(s), 0 fixed\n");
    const rendered: unknown = JSON.parse(renderJson([finding], 1));
    expect(rendered).toHaveProperty("summary", { advisory: 0, errors: 1, fixed: 1, notices: 0, total: 1 });
});
