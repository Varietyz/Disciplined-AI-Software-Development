import type { Stage, StageResult } from "./rule.types.ts";
import type { Finding } from "./segment.types.ts";
import type { ScopeSets } from "./scope.types.ts";
import type { TaxonomyData } from "./taxonomy.types.ts";

export interface RunOptions {
    readonly repoRoot: string;
    readonly ruleId: string | null;
    readonly stage: Stage | null;
    readonly scope: string | null;
    readonly bypass: readonly string[];
    readonly fix: boolean;
}

export interface RunResult {
    readonly findings: readonly Finding[];
    readonly stages: readonly StageResult[];
    readonly scanned: number;
    readonly registered: number;
    readonly bypassedAny: boolean;
    readonly scope: string;
    readonly authoritative: boolean;
    readonly moved: readonly string[];
    readonly movedByThisRun: readonly string[];
    readonly written: readonly string[];
    readonly escaped: readonly string[];
    readonly unfulfilled: readonly string[];
    readonly incomparable: readonly string[];
    readonly unresolvedScope?: string;
}

export interface JoinedRun {
    readonly verdict: string;
    readonly scope: string;
    readonly agent: string;
    readonly findings: number;
}

export interface RuleRun {
    readonly options: RunOptions;
    readonly scope: string;
    readonly authoritative: boolean;
    readonly byJurisdiction: ScopeSets["byJurisdiction"];
    readonly taxonomy: TaxonomyData;
    readonly read: (path: string) => string;
}

export interface RuleOutcome {
    readonly stage: StageResult;
    readonly findings: readonly Finding[];
    readonly written: readonly string[];
    readonly incomparable: boolean;
    readonly bypassed: boolean;
}
