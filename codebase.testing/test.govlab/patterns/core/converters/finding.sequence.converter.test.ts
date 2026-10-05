import { describe, expect, it } from "vitest";
import { SequenceAccumulator } from "@govlab/patterns/core/aggregators/representation.sequence.aggregator.ts";
import { sequenceFindings } from "@govlab/patterns/core/converters/finding.sequence.converter.ts";

describe("sequenceFindings", () => {
    it("reports transitions under the independence null, runs, and a next-value prediction", () => {
        const accumulator = new SequenceAccumulator("state");
        accumulator.update([{ state: "a" }, { state: "a" }, { state: "b" }, { state: "a" }]);
        const findings = sequenceFindings("state", accumulator.result());
        expect(findings.map((finding) => finding.name)).toStrictEqual(["transitions", "runs", "next-value-prediction"]);
        expect(findings[0]?.significance?.nullModel).toBe("transition-independence");
        expect(findings[2]?.coordinate.reasoning).toBe("prediction");
    });
});
