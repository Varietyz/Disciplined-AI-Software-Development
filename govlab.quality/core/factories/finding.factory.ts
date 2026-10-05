import type { AdvisoryContext, TerminationSignal, ToolExit } from "#types/tool.types";
import type { AdvisoryFindingInput, Finding, NoticeSpec, PassOutcome, RunResult } from "#types/finding.types";
import {
    NO_STDERR_DETAIL,
    UNKNOWN_SIGNAL,
    signalDeathMessage,
    spawnErrorMessage,
    toolErrorMessage,
} from "#configuration/strings/tool.strings";
import { spawnDetail, tailLines } from "#core/selectors/failure.selector";
import { POSITION } from "#configuration/constants/tool.constants";
import { PROJECT_TOOL } from "#configuration/constants/validation.constants";
import { formatFindings } from "#core/formatters/report.formatter";

export const EMPTY_RESULT: RunResult = { findings: [], fixedCount: 0, output: "" };

export const reportedPass = function reportedPass(findings: Finding[]): PassOutcome {
    return { findings, terminal: false };
};

export const terminatedPass = function terminatedPass(result: RunResult): PassOutcome {
    return { result, terminal: true };
};

export const findingsResult = function findingsResult(findings: Finding[], fixedCount = 0): RunResult {
    return { findings, fixedCount, output: formatFindings(findings) };
};

export const fixedResult = function fixedResult(reported: readonly Finding[], residual: Finding[]): RunResult {
    return findingsResult(residual, Math.max(0, reported.length - residual.length));
};

export const toolFinding = function toolFinding(
    input: AdvisoryFindingInput & { advisory?: boolean; fixable?: boolean },
): Finding {
    return {
        advisory: input.advisory ?? false,
        column: input.column,
        ecosystem: input.ecosystem,
        file: input.file,
        fixable: input.fixable ?? false,
        line: input.line,
        message: input.message,
        ruleId: input.ruleId,
        severity: "error",
        tool: input.tool,
    };
};

export const projectFinding = function projectFinding(input: {
    file: string;
    message: string;
    ruleId: string;
    suggestion: string;
}): Finding {
    return {
        advisory: false,
        column: 0,
        ecosystem: "",
        file: input.file,
        fixable: false,
        line: 0,
        message: input.message,
        ruleId: input.ruleId,
        severity: "error",
        suggestion: input.suggestion,
        tool: PROJECT_TOOL,
    };
};

export const advisoryFinding = function advisoryFinding(input: AdvisoryFindingInput): Finding {
    return toolFinding({ ...input, advisory: true });
};

const buildNotice = function buildNotice(context: AdvisoryContext, spec: NoticeSpec): RunResult {
    const finding: Finding = {
        advisory: spec.advisory,
        column: POSITION,
        ecosystem: context.ecosystem,
        file: context.root,
        fixable: false,
        line: POSITION,
        message: spec.message,
        ruleId: spec.ruleId,
        severity: spec.severity,
        tool: context.tool,
    };
    return { findings: [finding], fixedCount: 0, output: spec.output ?? spec.message };
};

const failureSpec = function failureSpec(context: AdvisoryContext, ruleId: string, message: string): NoticeSpec {
    return { advisory: context.gating !== true, message, ruleId, severity: context.failureSeverity ?? "notice" };
};

export const advisoryNotice = function advisoryNotice(
    context: AdvisoryContext,
    ruleId: string,
    message: string,
): RunResult {
    return buildNotice(context, { advisory: true, message, ruleId, severity: "notice" });
};

export const gatingNotice = function gatingNotice(
    context: AdvisoryContext,
    ruleId: string,
    message: string,
): RunResult {
    return buildNotice(context, failureSpec(context, ruleId, message));
};

export const toolErrorRule = function toolErrorRule(tool: string): string {
    return `${tool}/tool-error`;
};

export const toolFailure = function toolFailure(context: AdvisoryContext, message: string): RunResult {
    return gatingNotice(context, toolErrorRule(context.tool), message);
};

export const notInstalled = function notInstalled(context: AdvisoryContext): RunResult {
    return buildNotice(context, {
        advisory: true,
        message: context.installHint,
        output: context.notInstalledOutput ?? context.installHint,
        ruleId: `${context.tool}/not-installed`,
        severity: "notice",
    });
};

export const spawnFailure = function spawnFailure(context: AdvisoryContext, error: Error): RunResult {
    const message = spawnErrorMessage(context.tool, spawnDetail(error));
    return buildNotice(context, failureSpec(context, `${context.tool}/spawn-error`, message));
};

export const toolError = function toolError(context: AdvisoryContext, exit: ToolExit): RunResult {
    const message = toolErrorMessage(context.tool, exit.status, tailLines(exit.stderr, NO_STDERR_DETAIL));
    return gatingNotice(context, toolErrorRule(context.tool), message);
};

export const signalDeathResult = function signalDeathResult(
    source: { ecosystem: string; root: string; tool: string },
    signal: TerminationSignal | null,
): RunResult {
    const message = signalDeathMessage(source.tool, signal ?? UNKNOWN_SIGNAL);
    const finding: Finding = {
        advisory: false,
        column: POSITION,
        ecosystem: source.ecosystem,
        file: source.root,
        fixable: false,
        line: POSITION,
        message,
        ruleId: toolErrorRule(source.tool),
        severity: "error",
        tool: source.tool,
    };
    return { findings: [finding], fixedCount: 0, output: message };
};
