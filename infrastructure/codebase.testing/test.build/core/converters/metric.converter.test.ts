import { describe, expect, it } from "vitest";
import { anatomyMeasures } from "@banes-lab/build-scripts/core/converters/metric.converter.ts";
import { convert } from "./anatomy.fixture.ts";
import { renderAnatomyMeasures } from "@banes-lab/build-scripts/core/formatters/anatomy.formatter.ts";
import { resolutionRate } from "@govlab/patterns";
import { tallyOf } from "@banes-lab/build-scripts/core/converters/structure.converter.ts";

const FIRST = "first";
const SECOND = "second";

describe("anatomyMeasures", () => {
    it("adds every tree's measures, keeps the highest degrees, and lists each tree with its label", () => {
        const snapshot = convert();
        const measures = anatomyMeasures(
            [
                { exportName: "A", snapshot, tab: FIRST },
                { exportName: "B", snapshot, tab: SECOND },
            ],
            (tab) => tab.toUpperCase(),
        );
        expect(measures.stats.files).toBe(snapshot.tree.stats.files * 2);
        expect(measures.metrics.definitions).toBe(snapshot.metrics.definitions * 2);
        expect(measures.metrics.maxInDegree).toBe(snapshot.metrics.maxInDegree);
        expect(measures.metrics.resolutionRate).toBe(
            resolutionRate(snapshot.metrics.edges * 2, snapshot.metrics.unresolvedCalls * 2),
        );
        expect(measures.trees.map((tree) => [tree.tab, tree.label])).toStrictEqual([
            [FIRST, "FIRST"],
            [SECOND, "SECOND"],
        ]);
        expect(renderAnatomyMeasures(measures)).toContain("export const ANATOMY_MEASURES: AnatomyMeasures");
    });
});

describe("tallyOf", () => {
    it("adds counts by key across every part", () => {
        expect(tallyOf([{ a: 1, b: 2 }, { a: 3 }, {}])).toStrictEqual({ a: 4, b: 2 });
    });
});
