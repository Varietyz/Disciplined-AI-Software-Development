import type { Finding } from "#types/finding.types";
import { TREE_STRINGS } from "#configuration/strings/representation.strings";
import type { TreeSummary } from "#types/representation.types";
import { explanationFinding } from "#core/factories/finding.factory";
import { withSupport } from "#core/converters/finding.converter";

const labeled = function labeled(rows: readonly [string, number][], key: string): Readonly<Record<string, unknown>>[] {
    return rows.map(([name, count]) => ({ [key]: name, count }));
};

export const treeFindings = function treeFindings(field: string, summary: TreeSummary): Finding[] {
    const composition = explanationFinding({
        analysis: "structure",
        explained: TREE_STRINGS.compositionExplained,
        field,
        name: "composition",
        observation: { keys: labeled(summary.keys, "key"), leafTypes: labeled(summary.leafTypes, "type") },
        observed: TREE_STRINGS.compositionObserved(String(summary.keys.length), String(summary.totalLeaves)),
        ontology: "composition",
        representation: "symbolic",
    });
    const structure = explanationFinding({
        analysis: "structure",
        explained: TREE_STRINGS.structureExplained(String(summary.distinctShapes), String(summary.records)),
        field,
        name: "structure",
        observation: {
            distinctShapes: summary.distinctShapes,
            maxBranching: summary.maxBranching,
            maxDepth: summary.maxDepth,
            paths: labeled(summary.paths, "path"),
        },
        observed: TREE_STRINGS.structureObserved(String(summary.maxDepth), String(summary.maxBranching)),
        ontology: "structure",
        representation: "topology",
    });
    return withSupport([composition, structure], summary.records);
};
