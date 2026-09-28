import {
    AGGREGATE_REPORT,
    joinLiveRun,
    ruleReportName,
    supersedingRun,
    writePipelineReport,
} from "../reporters/rule.reporter.ts";
import {
    BYPASSED_RUN,
    JOINED,
    STREAMED,
    SUPERSEDED,
    UNATTRIBUTED,
    claimedUnwritten,
    covered,
    healingHeld,
    narrowedRun,
    notMeasured,
    otherRuns,
    repairedWhileReading,
    runContended,
    scopeUnresolved,
    wroteOutsideScope,
} from "../strings/pipeline.strings.ts";
import { GENERATED_DIR, NO_FIX_FLAG } from "../constants/path.constants.ts";
import { STAGES, type Stage, type StageResult } from "../types/rule.types.ts";
import { claimStanding, releaseStanding } from "../registries/claim.registry.ts";
import type { ClaimStanding } from "../types/claim.types.ts";
import type { PipelineReport } from "../types/rule.types.ts";
import type { RunResult } from "../types/pipeline.types.ts";
import { projectRoot } from "../../../config/surface.config.ts";
import { runPipeline } from "../orchestrators/pipeline.orchestrator.ts";
import { toPosix } from "../iterators/file.iterator.ts";

const REPO_ROOT = projectRoot();

export const RESTATES: readonly string[] = [
    "one_entry_point_staged_pipeline",
    "healing_is_default_in_every_entrypoint",
    "a_run_that_cannot_replace_the_aggregate_streams",
    "report_is_the_state",
];

interface RunIdentity {
    readonly agent: string;
    readonly at: number;
    readonly heal: boolean;
}

const argValue = function argValue(argv: readonly string[], flag: string): string | null {
    const index = argv.indexOf(flag);
    if (index === -1) {
        return null;
    }
    return argv[index + 1] ?? null;
};

const argList = function argList(argv: readonly string[], flag: string): string[] {
    return argv.flatMap((arg, at) => {
        const value = argv[at + 1];
        return arg === flag && value !== undefined ? value.split(",").filter((part) => part.length > 0) : [];
    });
};

const stageOf = function stageOf(argv: readonly string[]): Stage | null {
    const named = argValue(argv, "--stage");
    return STAGES.find((stage) => stage === named) ?? null;
};

const joinLive = async function joinLive(runAgent: string, runAt: number, notice: string): Promise<never> {
    releaseStanding(REPO_ROOT, runAgent, runAt);
    process.stdout.write(notice);

    const joined = await joinLiveRun(REPO_ROOT, runAt);
    process.stdout.write(joined.message);
    process.exit(joined.code);
};

const reportOf = function reportOf(run: RunIdentity, result: RunResult, standing: ClaimStanding): PipelineReport {
    const { agent, at, heal } = run;
    const walked = result.stages.filter((stage) => !stage.bypassed);
    const report: PipelineReport = {
        agent,
        at,
        authoritative: result.authoritative,
        bypassed: result.bypassedAny,
        derivations: {
            healingHeldBy: standing.overlapping,
            movedByThisRun: result.movedByThisRun,
            priorRunIncomplete: standing.incomplete,
            stagesBypassed: result.stages.filter((stage) => stage.bypassed).map((stage) => stage.rule),
            stagesWalked: walked.map((stage) => stage.rule),
        },
        escaped: result.escaped,
        findings: result.findings,
        mode: heal ? "healing" : "held",
        moved: result.moved,
        mutated: heal,
        registered: result.registered,
        reports: walked.map((stage) => `${GENERATED_DIR}/${ruleReportName(stage.rule)}`),
        scanned: result.scanned,
        scope: result.scope,
        stages: result.stages,
        tool: "govern",
        unfulfilled: result.unfulfilled,
        verdict: result.findings.length === 0 ? "pass" : "fail",
        written: result.written,
    };
    return report;
};

const writeWarnings = function writeWarnings(result: RunResult): void {
    if (result.escaped.length > 0) {
        process.stdout.write(wroteOutsideScope(result.escaped));
    }

    if (result.unfulfilled.length > 0) {
        process.stdout.write(claimedUnwritten(result.unfulfilled));
    }
};

const stageLine = function stageLine(stage: StageResult): string {
    const mark = stage.bypassed ? "BYPASS" : (stage.findings === 0 ? "  pass" : "  FAIL");
    const detail = stage.bypassed ? "skipped" : `${stage.findings} findings, ${stage.healed} healed`;
    return `  ${mark}  ${stage.stage}/${stage.rule}  ${detail}\n`;
};

const noticesOf = function noticesOf(report: PipelineReport, result: RunResult, superseded: number): string[] {
    return [
        report.bypassed ? BYPASSED_RUN : "",
        result.movedByThisRun.length === 0 ? "" : repairedWhileReading(result.movedByThisRun),
        result.moved.length === 0 ? "" : runContended(result.moved.length, result.moved),
        report.authoritative ? "" : narrowedRun(report.scope, AGGREGATE_REPORT),
        result.incomparable.length === 0 ? "" : notMeasured(result.incomparable),
        superseded === 0 ? "" : SUPERSEDED,
    ];
};

const summaryOf = function summaryOf(
    report: PipelineReport,
    result: RunResult,
    superseded: number,
    target: string | null,
): string {
    const counts = `registered=${report.registered} scanned=${report.scanned} findings=${report.findings.length}`;
    const destination = target === null ? STREAMED : `report: ${toPosix(REPO_ROOT, target)}\n`;
    return [
        `${report.verdict.toUpperCase()}  ${counts}\n`,
        ...result.stages.map(stageLine),
        ...noticesOf(report, result, superseded),
        destination,
    ].join("");
};

const announce = function announce(declaredCaller: string | null, standing: ClaimStanding): void {
    if (declaredCaller === null) {
        process.stdout.write(UNATTRIBUTED);
    }

    if (standing.message !== null) {
        process.stdout.write(otherRuns(standing.message));
    }
};

const settleStanding = async function settleStanding(
    standing: ClaimStanding,
    run: RunIdentity & { readonly asked: boolean },
): Promise<void> {
    if (run.asked && !run.heal) {
        process.stdout.write(healingHeld(standing.overlapping.length, standing.overlapping));
    }

    if (standing.decision === "yield") {
        await joinLive(run.agent, run.at, JOINED);
    }

    if (standing.covering.length > 0 && !run.heal) {
        await joinLive(run.agent, run.at, covered(standing.covering.length, standing.covering));
    }
};

const closeRun = function closeRun(report: PipelineReport, result: RunResult): never {
    if (result.unresolvedScope !== undefined) {
        releaseStanding(REPO_ROOT, report.agent, report.at);
        process.stdout.write(scopeUnresolved(result.unresolvedScope));
        process.exit(2);
    }

    const superseded = report.authoritative ? supersedingRun(REPO_ROOT, report.at) : 0;
    const target = writePipelineReport(REPO_ROOT, report);

    process.stdout.write(summaryOf(report, result, superseded, target));

    const unidentified = releaseStanding(REPO_ROOT, report.agent, report.at);
    if (unidentified !== null) {
        process.stdout.write(`${unidentified}\n`);
    }
    process.exit(report.verdict === "pass" ? 0 : 1);
};

const main = async function main(): Promise<void> {
    const argv = process.argv.slice(2);
    const asked = !argv.includes(NO_FIX_FLAG);

    const declaredCaller = argValue(argv, "--agent");
    const runAgent = declaredCaller ?? "an undeclared caller";
    const runAt = Date.now();

    const standing = claimStanding(REPO_ROOT, argValue(argv, "--scope") ?? "whole", runAt, runAgent);
    announce(declaredCaller, standing);

    const heal = asked && standing.overlapping.length === 0;
    await settleStanding(standing, { agent: runAgent, asked, at: runAt, heal });

    const result = await runPipeline({
        bypass: argList(argv, "--bypass"),
        fix: heal,
        repoRoot: REPO_ROOT,
        ruleId: argValue(argv, "--rule"),
        scope: argValue(argv, "--scope"),
        stage: stageOf(argv),
    });

    const report = reportOf({ agent: runAgent, at: runAt, heal }, result, standing);
    writeWarnings(result);
    closeRun(report, result);
};

void main();
