import { describe, expect, it } from "vitest";
import { TreeAccumulator } from "@govlab/patterns/core/aggregators/representation.tree.aggregator.ts";
import { treeFindings } from "@govlab/patterns/core/converters/finding.tree.converter.ts";

describe("treeFindings", () => {
    it("reports the composition and the structure of nested records", () => {
        const accumulator = new TreeAccumulator("meta");
        accumulator.update([{ meta: { a: 1, b: { c: "x" } } }, { meta: { a: 2 } }]);
        const findings = treeFindings("meta", accumulator.result());
        expect(findings.map((finding) => finding.name)).toStrictEqual(["composition", "structure"]);
        expect(findings.every((finding) => finding.support === 2)).toBe(true);
    });
});
