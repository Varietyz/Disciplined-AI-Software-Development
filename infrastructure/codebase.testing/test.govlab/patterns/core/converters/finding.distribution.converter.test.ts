import { describe, expect, it } from "vitest";
import { DistributionAccumulator } from "@govlab/patterns/core/aggregators/representation.distribution.aggregator.ts";
import { distributionFindings } from "@govlab/patterns/core/converters/finding.distribution.converter.ts";
import { isReasoningRung } from "@govlab/patterns/core/predicates/axis.predicate.ts";

const summaryOf = function summaryOf(records: readonly unknown[]): ReturnType<DistributionAccumulator["result"]> {
    const accumulator = new DistributionAccumulator("color");
    accumulator.update(records);
    return accumulator.result();
};

describe("distributionFindings", () => {
    const findings = distributionFindings(
        "color",
        summaryOf([{ color: "red" }, { color: "red" }, { color: "blue" }, { color: "green" }]),
    );

    it("emits coordinate-complete findings for every analysis it runs", () => {
        const names = findings.map((finding) => finding.name);
        expect(names).toStrictEqual([
            "frequency",
            "uniformity",
            "recency",
            "temperature",
            "drift",
            "complexity",
            "mode-prediction",
        ]);
        expect(findings.every((finding) => isReasoningRung(finding.coordinate.reasoning))).toBe(true);
    });

    it("attaches the uniformity null model to its finding and the support to every finding", () => {
        expect(findings.find((finding) => finding.name === "uniformity")?.significance?.nullModel).toBe("uniformity");
        expect(findings.every((finding) => finding.support === 4)).toBe(true);
    });

    it("adds a seasonality finding for ISO date values", () => {
        const dated = distributionFindings("day", summaryOf([{ color: "2026-01-01" }, { color: "2026-02-01" }]));
        expect(dated.map((finding) => finding.name)).toContain("seasonality");
    });
});
