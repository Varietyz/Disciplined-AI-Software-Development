import { expect, test } from "vitest";
import { filterBlockExcluded } from "@govlab/quality/core/selectors/block.selector.ts";

test("filterBlockExcluded returns the findings unchanged when there are no exclusions", () => {
    const findings = [{ file: "a.ts", line: 3, ruleId: "no-x" }];
    expect(filterBlockExcluded(findings, [], "/root")).toBe(findings);
});

test("filterBlockExcluded keeps findings whose excluded file cannot be read", () => {
    const findings = [
        { file: "a.ts", line: 3, ruleId: "no-x" },
        { file: "b.ts", line: 3, ruleId: "no-x" },
    ];
    const kept = filterBlockExcluded(findings, [{ file: "z.ts", functions: ["gone"], rule: "no-x" }], "/root");
    expect(kept).toHaveLength(findings.length);
});
