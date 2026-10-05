import type { Bucket, LargestEntry, State } from "#types/source.types";
import type { ActiveRuleStats } from "#types/rule.types";
import type { AnalysisStats } from "#types/code.types";
import type { AppStats } from "#types/site.types";
import type { DependencyGraph } from "#types/dependency.types";
import type { DocArchStats } from "#types/document.types";
import type { FindingsStats } from "#types/pattern.types";
import type { GitStats } from "#types/vcs.types";
import type { MemoryStats } from "#types/agent.types";
import type { QualityStats } from "#types/catalog.types";
import type { TaxonomyStats } from "#types/taxonomy.types";
import type { TypescriptStats } from "#types/config.types";
import type { WorkspaceStats } from "#types/manifest.types";

export interface VerifyStepStat {
    label: string;
    ok: boolean;
    violations: number | null;
}

export interface VerifyStageStat {
    failed: number;
    passed: number;
    stage: string;
    steps: VerifyStepStat[];
    violations: number;
}

export interface VerifyTotals {
    failed: number;
    passed: number;
    steps: number;
    violations: number;
}

export interface VerifyReportStats {
    available: boolean;
    generatedAt: string;
    label: string;
    ok: boolean;
    stages: VerifyStageStat[];
    totals: VerifyTotals;
}

export interface ReportInput {
    state: State;
    workspace: WorkspaceStats;
    docs: DocArchStats;
    git: GitStats | null;
    memory: MemoryStats;
    graph: DependencyGraph;
    packages: string[];
    findings: FindingsStats;
    app: AppStats;
    analysis: AnalysisStats;
    quality: QualityStats;
    taxonomy: TaxonomyStats;
    typescript: TypescriptStats;
    verify: VerifyReportStats;
    activeRules: ActiveRuleStats;
}

export interface Derived {
    areaRows: [string, Bucket][];
    authoredFiles: number;
    authoredLines: number;
    avgLines: number;
    emptyFiles: number;
    extRows: [string, Bucket][];
    largestLines: number;
    medianLines: number;
    p90Lines: number;
    sourceBlank: number;
    sourceLines: number;
    topLargest: LargestEntry[];
}
