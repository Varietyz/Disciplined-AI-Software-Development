import { NO_METRIC_GROUPS, metricsLine } from "@banes-lab/build-scripts/configuration/strings/metric.strings.ts";
import { describe, expect, it } from "vitest";

describe("metricsLine and NO_METRIC_GROUPS", () => {
    it("report the counts written, and name what a snapshot without groups lacks", () => {
        expect(metricsLine({ principles: 1, rules: 2, steps: 3, terms: 4 }, "metric.ts")).toContain(
            "2 rule(s), 3 gate step(s), 1 principle(s) and 4 term(s) into metric.ts",
        );
        expect(NO_METRIC_GROUPS).toContain("carries no principle and term groups");
    });
});
