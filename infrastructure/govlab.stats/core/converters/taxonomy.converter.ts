import type { RootScan, VocabularyStat } from "#types/taxonomy.types";
import type { Vocabulary } from "@ssot/govlab/types/taxonomy.types.ts";

const usedOf = function usedOf(
    declared: ReadonlySet<string>,
    scans: readonly RootScan[],
    pick: (scan: RootScan) => ReadonlySet<string>,
): number {
    const used = new Set(scans.flatMap((scan) => [...pick(scan)]));
    return [...declared].filter((word) => used.has(word)).length;
};

const row = function row(name: string, declared: number, used: number): VocabularyStat {
    return { declared, name, unused: Math.max(0, declared - used), used };
};

export const vocabularyRows = function vocabularyRows(
    host: Vocabulary,
    scans: readonly RootScan[],
    containers: { declared: number; layers: number; layerTotals: ReadonlyMap<string, number>; present: number },
): VocabularyStat[] {
    const tags = new Set(host.byTag.keys());
    return [
        row(
            "concern tags",
            tags.size,
            usedOf(tags, scans, (scan) => scan.usedConcerns),
        ),
        row(
            "subjects",
            host.subjects.size,
            usedOf(host.subjects, scans, (scan) => scan.usedSubjects),
        ),
        row(
            "variants",
            host.variants.size,
            usedOf(host.variants, scans, (scan) => scan.usedVariants),
        ),
        row("containers", containers.declared, containers.present),
        row("layers", containers.layers, [...containers.layerTotals.values()].filter((count) => count > 0).length),
    ];
};
