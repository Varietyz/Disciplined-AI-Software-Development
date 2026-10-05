import type { CodeFinding, CodeSymbol } from "#types/code.types";
import type { WalkCell, WalkNode } from "#types/walk.types";
import type { ModuleReport } from "#types/report.types";

export type Pruned = (folder: string) => boolean;

export interface FileEntry {
    rel: string;
    walk: WalkNode[];
    symbols: CodeSymbol[];
    records: Record<string, unknown>[];
}

export interface ModuleBuild {
    fanIn?: ReadonlyMap<string, number>;
    moduleName: string;
    title: string;
    extraFindings?: readonly CodeFinding[];
    testUses?: ReadonlySet<string>;
}

export interface BuiltModule {
    pages: Map<string, string>;
    svgs: Map<string, string>;
    cells: Map<string, WalkCell[]>;
    analysis: string;
    findings: string;
    findingsData: readonly CodeFinding[];
    report: ModuleReport;
}

export interface RepoContext {
    fanIn: Map<string, number>;
    packageMap: Map<string, string>;
    importCycles: Map<string, CodeFinding[]>;
}

export interface ModuleScope {
    root: string;
    pruned: Pruned;
}

export interface ModuleReportBuild {
    built: BuiltModule;
    entries: FileEntry[];
    title: string;
}

export interface DirScan {
    files: string[];
    dirs: string[];
    tests: string[];
}
