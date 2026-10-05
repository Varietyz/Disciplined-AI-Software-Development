import {
    budgetLine,
    budgetNotNumber,
    indexedLine,
    markersLine,
    stylesheetIndexedLine,
    stylesheetRuleUnnamed,
} from "@ssot/govlab/shared/strings/rule.strings.ts";
import { describe, expect, it } from "vitest";

describe("the rule indexer lines", () => {
    it("report what the indexer derived, and name a budget that is not a number", () => {
        expect(indexedLine(3, 1, "generated")).toBe(
            "[govlab-rules] indexed 3 local rules + 1 plugin wrapper(s) → generated\n",
        );
        expect(stylesheetIndexedLine(1, "stylelint-index.ts")).toContain(
            "indexed 1 local stylesheet rule(s) → stylelint-index.ts",
        );
        expect(stylesheetRuleUnnamed("a", "local/a")).toContain('createPlugin("local/a", rule)');
        expect(markersLine(2, "exclusions.ts")).toContain("derived 2 exclusion marker(s) → exclusions.ts");
        expect(budgetLine(200, "thresholds.ts")).toContain("the file budget (200) → thresholds.ts");
        expect(budgetNotNumber("file-length")).toContain("qualityMaster.concerns.file-length is not a number");
    });
});
