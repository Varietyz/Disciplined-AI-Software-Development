import type { CallEdge, CodeFinding, CodeGraph, CodeInsight, Distribution, SymbolStat } from "#types/code.types";
import type { WalkCell } from "#types/walk.types";

export interface DefinitionRecord {
    name: string;
    file: string;
    line: number;
    kind: string;
    exported: boolean;
    callable: boolean;
    flow: string;
    local: boolean;
    inDegree: number;
    outDegree: number;
    callees: string[];
    callers: string[];
}

export interface ReportMetrics {
    definitions: number;
    exported: number;
    callable: number;
    edges: number;
    resolutionRate: number;
    unresolvedCalls: number;
    flows: Record<string, number>;
    maxInDegree: number;
    maxOutDegree: number;
    findings: Record<string, number>;
}

export interface Crumb {
    label: string;
    page: string;
}

export interface NestedChild {
    label: string;
    page: string;
    count: number;
    defs: number;
    anomalies: number;
}

export interface ReportPage {
    id: string;
    rel: string;
    label: string;
    crumbs: Crumb[];
    walk: string | null;
    subtitle: string;
    nested: NestedChild[];
    distribution: Distribution;
    files: string[];
    findings: CodeFinding[];
    metrics: ReportMetrics;
}

export interface ModuleReport {
    module: string;
    metrics: ReportMetrics;
    pages: ReportPage[];
    findings: CodeFinding[];
    unresolvedCalls: string[];
    definitions: DefinitionRecord[];
    edges: CallEdge[];
}

export interface PageRender {
    label: string;
    crumbs: Crumb[];
    mainSvg: string;
    mainCells: WalkCell[];
    walkSubtitle: string;
    nestedSvg: string;
    nestedCells: WalkCell[];
    nestedSubtitle: string;
    nested: NestedChild[];
    symbols: SymbolStat[];
    findings: CodeFinding[];
    distribution: Distribution;
    definitions: number;
    fanIn: ReadonlyMap<string, number>;
}

export interface MetricScope {
    symbols: readonly SymbolStat[];
    edges: readonly CallEdge[];
    unresolved: number;
    findings: readonly CodeFinding[];
}

export interface ModuleFindings {
    module: string;
    findings: readonly CodeFinding[];
}

export interface AnalysisModel {
    insight: CodeInsight;
    graph: CodeGraph;
    findingsCount: number;
    title: string;
}

export type HealState = "clean" | "drift" | "healed" | "rewritten";

export interface ModuleArtifacts {
    artifacts: Map<string, string>;
    findings: ModuleFindings;
    svgs: Map<string, string>;
}

export interface DriftProbe extends ModuleArtifacts {
    drift: boolean;
}

export interface HealResult {
    findings: ModuleFindings;
    state: HealState;
    svgs: Map<string, string>;
}

export interface HealOps {
    attempts: number;
    generate: (moduleDir: string) => Promise<ModuleArtifacts>;
    reparse: (moduleDir: string) => Promise<void>;
}

export interface CheckOps extends HealOps {
    masterOk: (collected: readonly ModuleFindings[]) => boolean;
    modules: readonly string[];
    pool: (items: readonly string[], worker: (item: string) => Promise<void>) => Promise<void>;
    title: (moduleDir: string) => string;
    writeMaster: () => void;
    writeSvgs: (byModule: ReadonlyMap<string, ReadonlyMap<string, string>>) => void;
}

export interface ModuleSvgs {
    slug: string;
    svgs: ReadonlyMap<string, string>;
}

export interface ModuleTitle {
    dir: string;
    title: string;
}
