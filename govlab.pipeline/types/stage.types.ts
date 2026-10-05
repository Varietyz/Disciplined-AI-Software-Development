import type { ShellDescriptor } from "#types/shell.types";
import type { StepOutput } from "#types/report.types";

export interface ParallelStep {
    label: string;
    run: string;
    cwd?: string;
    tags?: readonly string[];
}

export interface Step {
    label?: string;
    run?: string;
    cwd?: string;
    parallel?: ParallelStep[];
    tags?: readonly string[];
}

export interface Stage {
    slug: string;
    label: string;
    bypass?: boolean;
    steps: Step[];
}

export interface Member {
    id: string;
    dir: string;
    tests: string | null;
    gated: boolean;
}

export interface StageOptions {
    readonly cleanCommentsIgnore: string;
    readonly hexIgnore: string;
    readonly qualityRoot: string;
    readonly scope: ReadonlySet<string>;
}

export interface StagePlan {
    readonly skippedWide: readonly string[];
    readonly stages: Stage[];
}

export interface StageScope {
    readonly appOnly: <T>(steps: T[]) => T[];
    readonly codemodScope: string;
    readonly options: StageOptions;
    readonly scoped: readonly Member[];
    readonly scopedDirs: readonly string[];
    readonly testTargets: readonly string[];
    readonly wide: (steps: Step[]) => Step[];
}

export interface StageArgs {
    bypass: Set<string>;
    run: Set<string>;
    members: Set<string>;
    only: Set<string>;
    tags: Set<string>;
    skipTags: Set<string>;
    report: boolean;
}

export interface AbortInfo {
    label: string;
    tag: string;
    stepLabel: string;
    elapsed: string;
    status: number;
    command: string;
    notRun: number;
}

export interface HeaderInfo {
    label: string;
    total: number;
    activeCount: number;
    bypassed: Stage[];
    scope: readonly string[];
}

export interface SubResult {
    code: number;
    out: string;
    sub: ParallelStep;
}

export interface PlannedStep {
    stage: Stage;
    step: Step;
    firstInStage: boolean;
}

export interface Unit {
    stage: Stage;
    step: Step;
    from: number;
    to: number;
    firstInStage: boolean;
}

export interface ReportRow {
    code: number;
    count: number | null;
    label: string;
    out: string;
    stage: string;
}

export interface StepArtifact {
    label: string;
    ok: boolean;
    violations: number | null;
}

export interface StageArtifact {
    failed: number;
    passed: number;
    stage: string;
    steps: StepArtifact[];
    violations: number;
}

export interface ReportArtifact {
    generatedAt: string;
    label: string;
    ok: boolean;
    stages: StageArtifact[];
    totals: { failed: number; passed: number; steps: number; violations: number };
}

export interface RunOptions {
    reportPath?: string;
    violationsPath?: string;
    writeReport?: (target: string, data: unknown) => Promise<void>;
}

export interface RunContext {
    readonly args: StageArgs;
    readonly options: RunOptions;
    readonly shell: ShellDescriptor;
}

export interface StepStore {
    readonly collect: (output: StepOutput) => void;
    readonly outputs: () => readonly StepOutput[];
}

export interface ActiveRun {
    readonly context: RunContext;
    readonly label: string;
    readonly store: StepStore;
    readonly total: number;
}
