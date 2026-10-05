import type { AdvisoryContext, ScanSpec, ToolExit, ToolSpawn } from "#types/tool.types";
import type { Finding, PassOutcome, RunResult } from "#types/finding.types";
import { isNotFound, signalKilled, statusIn } from "#core/predicates/failure.predicate";
import {
    notInstalled,
    reportedPass,
    signalDeathResult,
    spawnFailure,
    terminatedPass,
} from "#core/factories/finding.factory";
import { UNKNOWN_STATUS } from "#configuration/constants/tool.constants";

export const exitOf = function exitOf(result: ToolSpawn): ToolExit {
    return { status: result.status ?? UNKNOWN_STATUS, stderr: result.stderr, stdout: result.stdout };
};

export const terminalOf = function terminalOf(advisory: AdvisoryContext, result: ToolSpawn): RunResult | null {
    if (result.error) {
        return isNotFound(result.error) ? notInstalled(advisory) : spawnFailure(advisory, result.error);
    }
    return signalKilled(result.status) ? signalDeathResult(advisory, result.signal) : null;
};

export const failedWhenEmpty = function failedWhenEmpty(
    statuses: ReadonlySet<number>,
): (result: ToolSpawn, findings: readonly Finding[]) => boolean {
    return (result, findings) => findings.length === 0 && !statusIn(statuses, result.status);
};

export const failedOnStatus = function failedOnStatus(statuses: ReadonlySet<number>): (result: ToolSpawn) => boolean {
    return (result) => !statusIn(statuses, result.status);
};

export const passOf = function passOf(advisory: AdvisoryContext, result: ToolSpawn, spec: ScanSpec): PassOutcome {
    const terminal = terminalOf(advisory, result);
    if (terminal !== null) {
        return terminatedPass(terminal);
    }
    const findings = spec.parse(result);
    return spec.failed(result, findings) ? terminatedPass(spec.failure(exitOf(result))) : reportedPass(findings);
};
