import { describe, expect, it } from "vitest";
import { VectorAccumulator } from "@govlab/patterns/core/aggregators/representation.vector.aggregator.ts";
import { vectorFindings } from "@govlab/patterns/core/converters/finding.vector.converter.ts";

const OUTLIER = 1000;

describe("vectorFindings", () => {
    it("reports the distribution and the autocorrelation, and an anomaly when an outlier exists", () => {
        const accumulator = new VectorAccumulator("score");
        accumulator.update([{ score: 1 }, { score: 2 }, { score: 1 }, { score: OUTLIER }]);
        const findings = vectorFindings("score", accumulator.result());
        expect(findings.map((finding) => finding.name)).toStrictEqual(["distribution", "autocorrelation", "anomaly"]);
        expect(findings[1]?.significance?.nullModel).toBe("autocorrelation-independence");
    });
});
