import type { AnatomyMeasures, TreeMeasure } from "@banes-lab/web/types/metric.types.js";
import { sumStats, tallyOf } from "#core/converters/structure.converter";
import type { AnatomyMetrics } from "@banes-lab/web/types/anatomy.types.js";
import type { DerivedTree } from "#types/anatomy.types";
import { resolutionRate } from "@govlab/patterns";

const summed = function summed(parts: readonly AnatomyMetrics[]): AnatomyMetrics {
    const total = function total(pick: (part: AnatomyMetrics) => number): number {
        return parts.reduce((sum, part) => sum + pick(part), 0);
    };
    const edges = total((part) => part.edges);
    const unresolvedCalls = total((part) => part.unresolvedCalls);
    return {
        callable: total((part) => part.callable),
        definitions: total((part) => part.definitions),
        edges,
        exported: total((part) => part.exported),
        findings: tallyOf(parts.map((part) => part.findings)),
        flows: tallyOf(parts.map((part) => part.flows)),
        maxInDegree: Math.max(0, ...parts.map((part) => part.maxInDegree)),
        maxOutDegree: Math.max(0, ...parts.map((part) => part.maxOutDegree)),
        resolutionRate: resolutionRate(edges, unresolvedCalls),
        unresolvedCalls,
    };
};

export const anatomyMeasures = function anatomyMeasures(
    trees: readonly DerivedTree[],
    labelOf: (tab: string) => string,
): AnatomyMeasures {
    const measured: readonly TreeMeasure[] = trees.map((tree) => ({
        label: labelOf(tree.tab),
        metrics: tree.snapshot.metrics,
        stats: tree.snapshot.tree.stats,
        tab: tree.tab,
    }));
    return {
        metrics: summed(measured.map((tree) => tree.metrics)),
        stats: sumStats(measured.map((tree) => tree.stats)),
        trees: measured,
    };
};
