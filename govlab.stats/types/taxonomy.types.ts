export type ContainerKind = "bucket" | "declared";

export interface ContainerStat {
    files: number;
    kind: ContainerKind;
    name: string;
}

export interface TaxonomyRootStats {
    assessed: number;
    conformant: number;
    containers: ContainerStat[];
    declared: number;
    depth: Map<number, number>;
    overCap: number;
    present: number;
    root: string;
}

export interface VocabularyStat {
    declared: number;
    name: string;
    unused: number;
    used: number;
}

export interface UngovernedArea {
    area: string;
    files: number;
}

export interface TaxonomyTotals {
    assessed: number;
    atRoot: number;
    conformant: number;
    declared: number;
    overCap: number;
    present: number;
}

export interface TaxonomyStats {
    layers: { files: number; layer: string }[];
    maxDepth: number;
    roots: TaxonomyRootStats[];
    totals: TaxonomyTotals;
    ungoverned: UngovernedArea[];
    ungovernedFiles: number;
    vocabulary: VocabularyStat[];
}

export interface RootScan {
    layerHits: Map<string, number>;
    stats: TaxonomyRootStats;
    usedConcerns: Set<string>;
    usedSubjects: Set<string>;
    usedVariants: Set<string>;
}

export interface AssessedFile {
    readonly abs: string;
    readonly folders: readonly string[];
    readonly name: string;
}
