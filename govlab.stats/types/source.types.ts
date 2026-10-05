import type { PathExclusion } from "@govlab/quality/config";

export type FileRole = "data" | "other" | "prose" | "source";

export type ExcludedKind = "binary" | "generated" | "ingested";

export interface LineCount {
    blank: number;
    code: number;
    total: number;
}

export interface Bucket {
    blank: number;
    bytes: number;
    code: number;
    files: number;
    total: number;
}

export interface LargestEntry {
    lines: number;
    path: string;
}

export interface State {
    authored: Map<FileRole, Bucket>;
    byArea: Map<string, Bucket>;
    byExt: Map<string, Bucket>;
    bytes: number;
    dirs: number;
    excluded: Map<ExcludedKind, Bucket>;
    fileLineCounts: number[];
    files: number;
    largest: LargestEntry[];
    lines: LineCount;
    manifestFiles: number;
    maxDepth: number;
    testFiles: number;
    textFiles: number;
    unclassified: Map<string, Bucket>;
}

export interface LineScan {
    readonly total: number;
    readonly blank: number;
    readonly runLength: number;
    readonly sawNonSpace: boolean;
}

export type FileClass = ExcludedKind | "authored" | "binary";

export interface Observation {
    readonly area: string;
    readonly class: FileClass;
    readonly ext: string;
    readonly lines: LineCount;
    readonly manifest: boolean;
    readonly rel: string;
    readonly role: FileRole;
    readonly size: number;
    readonly test: boolean;
}

export interface ExcludedObservation extends Observation {
    readonly class: ExcludedKind;
}

export interface Walk {
    readonly dirs: number;
    readonly files: readonly Observation[];
}

export interface ScanScope {
    readonly ignore: PathExclusion;
    readonly members: readonly string[];
    readonly root: string;
}
