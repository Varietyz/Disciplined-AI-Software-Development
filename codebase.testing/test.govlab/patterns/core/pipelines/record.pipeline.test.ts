import { analyze, report } from "@govlab/patterns/core/pipelines/record.pipeline.ts";
import { describe, expect, it } from "vitest";
import { isMathType } from "@govlab/patterns/core/predicates/math.predicate.ts";
import { isReasoningRung } from "@govlab/patterns/core/predicates/axis.predicate.ts";

const S1 = 3;
const S2 = 7;
const S3 = 5;
const S4 = 9;

const records = function records(): Record<string, unknown>[] {
    return [
        { color: "red", score: S1 },
        { color: "red", score: S2 },
        { color: "blue", score: S3 },
        { color: "red", score: S4 },
    ];
};

describe("analyze", () => {
    it("produces a graph-validated findings report over the inferred representations", () => {
        const result = analyze(records());
        expect(result.schema.map((field) => field.name)).toStrictEqual(["color", "score"]);
        const names = new Set(result.findings.map((finding) => finding.name));
        expect(names.has("frequency")).toBe(true);
        expect(names.has("distribution")).toBe(true);
        expect(() => {
            result.graph.validate();
        }).not.toThrow();
    });

    it("stamps every finding with a complete coordinate and a declared math type", () => {
        for (const finding of analyze(records()).findings) {
            expect(isReasoningRung(finding.coordinate.reasoning)).toBe(true);
            expect(isMathType(finding.mathType)).toBe(true);
        }
    });

    it("emits prediction-rung findings for the mode and the next value", () => {
        const predictions = analyze(records()).findings.filter(
            (finding) => finding.coordinate.reasoning === "prediction",
        );
        expect(predictions.map((finding) => finding.name)).toContain("mode-prediction");
        expect(predictions.map((finding) => finding.name)).toContain("next-value-prediction");
    });

    it("routes a coordinate-pair field to the grid representation", () => {
        const names = analyze([{ point: [0, 0] }, { point: [1, 1] }]).findings.map((finding) => finding.name);
        expect(names).toContain("density");
    });
});

describe("report", () => {
    it("produces a valid empty report for empty, all-null and field-less input", () => {
        for (const degenerate of [[], [{ a: null }, { a: null }], [{}, {}]]) {
            const result = report(degenerate);
            expect(result.findings).toStrictEqual([]);
            expect(result.headline.findings).toBe(0);
        }
    });
});
