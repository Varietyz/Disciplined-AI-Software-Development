import type { ChildProcess, SpawnSyncReturns } from "node:child_process";
import type { Finding, FindingSeverity, RunResult } from "#types/finding.types";
import type { ConcernConfig } from "#types/concern.types";
import type process from "node:process";

export interface PrettierEmitPolicy {
    concerns?: ConcernConfig | undefined;
    base?: Record<string, unknown> | undefined;
}

export type ProcessEnv = typeof process.env;

export type TerminationSignal = NonNullable<ChildProcess["signalCode"]>;

export type ToolSpawn = SpawnSyncReturns<string>;

export interface RunnerContext {
    root: string;
    paths: string[];
    fix: boolean;
    ecosystem: string;
    languageId: string;
    elected?: boolean | undefined;
    dryRun?: boolean | undefined;
    backup?: boolean | undefined;
    env?: ProcessEnv | undefined;
}

export type Runner = (context: RunnerContext) => Promise<RunResult> | RunResult;

export interface ToolRunner {
    tool: string;
    ecosystems: readonly string[];
    run: Runner;
}

export interface AdvisoryContext {
    ecosystem: string;
    installHint: string;
    root: string;
    tool: string;
    failureSeverity?: FindingSeverity;
    gating?: boolean;
    notInstalledOutput?: string;
}

export interface ToolExit {
    status: number;
    stderr: string;
    stdout: string;
}

export interface CommandInvocation {
    bin: string;
    prefix: string[];
}

export interface AdvisoryToolSpec {
    tool: string;
    argsFor: (context: RunnerContext) => string[];
    cwdFor: (context: RunnerContext) => string;
    statusOk: (status: number | null) => boolean;
    stream?: "stderr" | "stdout";
    parse: (output: string, ecosystem: string) => Finding[];
}

export interface SelectableToolSpec {
    tool: string;
    configFilename: string;
    loadConfig: (root: string) => Promise<string>;
    argsFor: (configFile: string | null, context: RunnerContext) => string[];
    cwdFor: (context: RunnerContext) => string;
    statusOk: (status: number | null) => boolean;
    parse: (stdout: string, ecosystem: string, advisory: boolean) => Finding[];
}

export interface ToolCall {
    bin: string;
    args: string[];
    cwd: string;
    env?: ProcessEnv | undefined;
}

export interface ScanSpec {
    parse: (result: ToolSpawn) => Finding[];
    failed: (result: ToolSpawn, findings: readonly Finding[]) => boolean;
    failure: (exit: ToolExit) => RunResult;
}

export type ScanOutcome =
    { findings: Finding[]; kind: "findings" } | { kind: "skip" } | { kind: "terminal"; result: RunResult };
