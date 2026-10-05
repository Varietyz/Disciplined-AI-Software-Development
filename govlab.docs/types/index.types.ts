import type { DeadEdge } from "#types/document.types";

export interface PackageInfo {
    group: string;
    barrelExports: number;
    description: string;
    externalDeps: string[];
    hasReadme: boolean;
    name: string;
    path: string;
    purpose: string | null;
    siblingDeps: string[];
    slug: string;
    sourceFiles: number;
    sourceLoc: number;
    version: string;
}

export interface InspectContext {
    group: string;
    packageName: string;
    repoRoot: string;
}

export interface SourceStats {
    fileCount: number;
    loc: number;
}

export type ByGroup = Record<string, PackageInfo[]>;

export interface RenderedIndex {
    count: number;
    groups: number;
    json: string;
    md: string;
}

export interface WeightedUnit {
    cost: number;
    id: string;
}

export interface JobSpec {
    args: string[];
    command: string;
    cwd: string;
    label: string;
    timeoutMs: number;
}

export interface JobResult {
    code: number;
    label: string;
    out: string;
    timedOut: boolean;
}

export interface CatalogDocEntry {
    concern: string;
    dependsOn: string[];
    governs: string[];
    links: string[];
    name: string;
    path: string;
    status: string;
    summary: string;
    superseded: boolean;
    supersedes: string[];
    type: string;
}

export interface CatalogPayload {
    byConcern: Record<string, string[]>;
    byStatus: Record<string, string[]>;
    byType: Record<string, string[]>;
    cycles: string[][];
    deadEdges: DeadEdge[];
    docs: CatalogDocEntry[];
    duplicateNames: string[];
    superseded: string[];
}

export interface CoverageRow {
    gaps: string[];
    isPrivate: boolean;
    slug: string;
}
