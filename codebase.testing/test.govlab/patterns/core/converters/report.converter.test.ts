import { describe, expect, it } from "vitest";
import { graphToDict, toReport } from "@govlab/patterns/core/converters/report.converter.ts";
import { analyze } from "@govlab/patterns/core/pipelines/record.pipeline.ts";

describe("the report converter", () => {
    it("counts the graph's edges alongside its nodes", () => {
        const { graph } = analyze([{ color: "red" }]);
        const dict = graphToDict(graph);
        expect(dict.nodes).toHaveLength(graph.nodes.length);
        expect(dict.edges).toBe(graph.nodes.reduce((sum, node) => sum + node.inputs.length, 0));
    });

    it("heads the report with its record, field and finding counts and covers each ontology-analysis cell", () => {
        const result = analyze([{ color: "red" }, { color: "blue" }]);
        const reported = toReport(2, result);
        expect(reported.headline).toStrictEqual({ fields: 1, findings: result.findings.length, records: 2 });
        expect(reported.coverage.counts.findings).toBe(result.findings.length);
        expect(reported.coverage.filled.every((cell) => cell.length === 2)).toBe(true);
    });
});
