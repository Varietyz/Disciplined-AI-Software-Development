import type { AnatomyInputs, AnatomyLookups, WalkAssets } from "#types/anatomy.types";
import type { DefinitionView, FindingView } from "@banes-lab/web/types/anatomy.types.js";
import { definitionsByFile, findingView, flaggedOf } from "#core/converters/report.converter";
import type { DiskFile } from "#types/structure.types";
import type { FileEntry } from "@govlab/patterns";

interface ParsedParts {
    readonly definitions: readonly DefinitionView[];
    readonly entry: FileEntry | null;
    readonly findings: readonly FindingView[];
}

const UNPARSED: ParsedParts = { definitions: [], entry: null, findings: [] };

const groupBy = function groupBy<T>(items: readonly T[], keyOf: (item: T) => string): Map<string, T[]> {
    const groups = new Map<string, T[]>();
    for (const item of items) {
        groups.set(keyOf(item), [...(groups.get(keyOf(item)) ?? []), item]);
    }
    return groups;
};

const countBy = function countBy<T>(items: readonly T[], keyOf: (item: T) => string): Map<string, number> {
    const counts = new Map<string, number>();
    for (const item of items) {
        counts.set(keyOf(item), (counts.get(keyOf(item)) ?? 0) + 1);
    }
    return counts;
};

export const lookupsOf = function lookupsOf(inputs: AnatomyInputs, assets: WalkAssets): AnatomyLookups {
    return {
        assets,
        definitions: definitionsByFile(inputs.report),
        documents: inputs.documents,
        edgesByFile: countBy(inputs.report.edges, (edge) => edge.file),
        entries: new Map(inputs.entries.map((entry) => [entry.rel, entry])),
        findingsByFile: groupBy(inputs.report.findings.map(findingView), (finding) => finding.file),
        flagged: flaggedOf(inputs.report.findings),
        inputs,
    };
};

export const parsedPartsOf = function parsedPartsOf(lookups: AnatomyLookups, file: DiskFile): ParsedParts {
    if (file.excluded !== undefined) {
        return UNPARSED;
    }
    return {
        definitions: lookups.definitions.get(file.path) ?? [],
        entry: lookups.entries.get(file.path) ?? null,
        findings: lookups.findingsByFile.get(file.path) ?? [],
    };
};
