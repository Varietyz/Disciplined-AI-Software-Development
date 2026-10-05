import type {
    AdvisoryContext,
    AdvisoryToolSpec,
    RunnerContext,
    ScanSpec,
    SelectableToolSpec,
    ToolCall,
    ToolExit,
} from "#types/tool.types";
import { EMPTY_RESULT, findingsResult, fixedResult, toolError, toolFailure } from "#core/factories/finding.factory";
import type { Finding, PassOutcome, RunResult } from "#types/finding.types";
import { exitOf, failedWhenEmpty, passOf, terminalOf } from "#core/classifiers/invocation.classifier";
import { signalKilled, statusIn } from "#core/predicates/failure.predicate";
import { electedMissing } from "#configuration/strings/tool.strings";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { spawnTool } from "#core/adapters/invocation.adapter";
import { writeToolFile } from "#core/persistence/tool.persistence";

export const passTool = function passTool(advisory: AdvisoryContext, call: ToolCall, spec: ScanSpec): PassOutcome {
    const result = spawnTool(call.bin, call.args, { cwd: call.cwd, encoding: "utf8", env: call.env, shell: false });
    return passOf(advisory, result, spec);
};

export const scanTool = function scanTool(advisory: AdvisoryContext, call: ToolCall, spec: ScanSpec): RunResult {
    const outcome = passTool(advisory, call, spec);
    return outcome.terminal ? outcome.result : findingsResult(outcome.findings);
};

export const scanTargets = function scanTargets(
    targets: readonly string[],
    scanOne: (target: string) => PassOutcome | null,
): RunResult {
    const findings: Finding[] = [];
    for (const target of targets) {
        const outcome = scanOne(target);
        if (outcome?.terminal === true) {
            return outcome.result;
        }
        findings.push(...(outcome?.findings ?? []));
    }
    return findingsResult(findings);
};

export const fixCycle = function fixCycle(
    reported: PassOutcome,
    shouldFix: (findings: readonly Finding[]) => boolean,
    applyFix: (findings: Finding[]) => RunResult,
): RunResult {
    if (reported.terminal) {
        return reported.result;
    }
    return shouldFix(reported.findings) ? applyFix(reported.findings) : findingsResult(reported.findings);
};

export const residualOf = function residualOf(reported: readonly Finding[], outcome: PassOutcome): RunResult {
    return outcome.terminal ? outcome.result : fixedResult(reported, outcome.findings);
};

export const standardScan = function standardScan(
    advisory: AdvisoryContext,
    statuses: ReadonlySet<number>,
    parse: ScanSpec["parse"],
): ScanSpec {
    return { failed: failedWhenEmpty(statuses), failure: (exit) => toolError(advisory, exit), parse };
};

export const messageScan = function messageScan(
    advisory: AdvisoryContext,
    statuses: ReadonlySet<number>,
    parse: ScanSpec["parse"],
    message: (exit: ToolExit) => string,
): ScanSpec {
    return { failed: failedWhenEmpty(statuses), failure: (exit) => toolFailure(advisory, message(exit)), parse };
};

export const runAdvisory = function runAdvisory(spec: AdvisoryToolSpec, context: RunnerContext): RunResult {
    const result = spawnTool(spec.tool, spec.argsFor(context), {
        cwd: spec.cwdFor(context),
        encoding: "utf8",
        shell: false,
    });
    if (result.error || signalKilled(result.status) || !spec.statusOk(result.status)) {
        return EMPTY_RESULT;
    }
    const output = spec.stream === "stderr" ? result.stderr : result.stdout;
    return findingsResult(spec.parse(output, context.ecosystem));
};

export const runSelectable = async function runSelectable(
    spec: SelectableToolSpec,
    context: RunnerContext,
): Promise<RunResult> {
    const advisory = context.elected === false;
    const advisoryContext = gatingAdvisory(context, spec.tool, electedMissing(spec.tool));
    const configFile =
        context.elected === true
            ? writeToolFile(context.root, spec.configFilename, await spec.loadConfig(context.root))
            : null;
    const result = spawnTool(spec.tool, spec.argsFor(configFile, context), {
        cwd: spec.cwdFor(context),
        encoding: "utf8",
        shell: false,
    });
    const terminal = terminalOf(advisoryContext, result);
    if (terminal !== null) {
        return advisory ? EMPTY_RESULT : terminal;
    }
    if (!spec.statusOk(result.status)) {
        return advisory ? EMPTY_RESULT : toolError(advisoryContext, exitOf(result));
    }
    return findingsResult(spec.parse(result.stdout, context.ecosystem, advisory));
};

export const statusOkIn = function statusOkIn(statuses: ReadonlySet<number>): (status: number | null) => boolean {
    return (status) => statusIn(statuses, status);
};
