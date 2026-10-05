import { describe, expect, it } from "vitest";
import { GraphAccumulator } from "@govlab/patterns/core/aggregators/representation.graph.aggregator.ts";
import { graphFindings } from "@govlab/patterns/core/converters/finding.graph.converter.ts";

const summaryOf = function summaryOf(records: readonly unknown[]): ReturnType<GraphAccumulator["result"]> {
    const accumulator = new GraphAccumulator("tags");
    accumulator.update(records);
    return accumulator.result();
};

describe("graphFindings", () => {
    it("reports co-occurrence, lift and member uniformity over string lists", () => {
        const findings = graphFindings("tags", summaryOf([{ tags: ["a", "b"] }, { tags: ["a", "c"] }]));
        const names = findings.map((finding) => finding.name);
        expect(names).toStrictEqual(["member-uniformity", "cooccurrence", "lift", "positional", "combinatorics"]);
        expect(findings[0]?.significance?.nullModel).toBe("member-uniformity");
    });

    it("adds composition and ordered-domain findings over numeric lists", () => {
        const names = graphFindings("tags", summaryOf([{ tags: [1, 2] }, { tags: [2, 3] }])).map(
            (finding) => finding.name,
        );
        expect(names).toContain("composition");
        expect(names).toContain("ordered-domain");
    });
});
