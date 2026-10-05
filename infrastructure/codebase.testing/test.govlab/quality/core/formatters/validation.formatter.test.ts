import { expect, test } from "vitest";
import { projectFinding } from "@govlab/quality/core/factories/finding.factory.ts";
import { renderPanel } from "@govlab/quality/core/formatters/validation.formatter.ts";

test("renderPanel reads clean for no findings and lists each finding with its suggestion", () => {
    expect(renderPanel([])).toContain("CLEAN");
    const panel = renderPanel([projectFinding({ file: "a.css", message: "m", ruleId: "r", suggestion: "fix it" })]);
    expect(panel).toContain("1 finding(s)");
    expect(panel).toContain("a.css");
    expect(panel).toContain("fix it");
});
