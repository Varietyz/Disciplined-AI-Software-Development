import { describe, expect, it } from "vitest";
import { DISCOVERY_CLEAN } from "@banes-lab/build-scripts/configuration/strings/validation.strings.ts";
import { reportOf } from "@banes-lab/build-scripts/core/formatters/validation.formatter.ts";

describe("reportOf", () => {
    it("reports a clean run in one line and otherwise lists each finding under the count", () => {
        expect(reportOf([])).toBe(DISCOVERY_CLEAN);
        const report = reportOf([{ file: "terms.html", message: "The title is empty." }]);
        expect(report.split("\n")).toStrictEqual([
            "[discovery] 1 finding(s):",
            "  terms.html  The title is empty.",
            "",
        ]);
    });
});
