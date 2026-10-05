import type { AdvisoryContext, RunnerContext, ScanSpec, ToolCall } from "#types/tool.types";
import {
    EMPTY_RESULT,
    findingsResult,
    fixedResult,
    signalDeathResult,
    toolFailure,
} from "#core/factories/finding.factory";
import { NO_STDERR_DETAIL, commandHint, toolErrorBecause } from "#configuration/strings/tool.strings";
import { fixCycle, passTool } from "#core/adapters/tool.adapter";
import { freshToolFile, readToolReport, writeToolFile } from "#core/persistence/tool.persistence";
import { nativeToolConfig, toolSetting } from "#core/resolvers/tool.resolver";
import { signalKilled, statusIn } from "#core/predicates/failure.predicate";
import { FINDING_STATUSES } from "#configuration/constants/tool.constants";
import type { RunResult } from "#types/finding.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { failedOnStatus } from "#core/classifiers/invocation.classifier";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { parseSqlfluffOutput } from "#core/parsers/tool.sqlfluff.parser";
import { scopedFiles } from "#core/resolvers/scope.resolver";
import { spawnTool } from "#core/adapters/invocation.adapter";
import { tailLines } from "#core/selectors/failure.selector";

const TOOL = "sqlfluff";
const LANGUAGE = "sql";
const CONFIG_FILE = ".sqlfluff";
const REPORT_FILE = "sqlfluff-report.json";
const DEFAULTS = { command: "python -m sqlfluff", dialect: "ansi" };

interface Job {
    advisory: AdvisoryContext;
    bin: string;
    common: string[];
    files: string[];
    prefix: string[];
    reportFile: string;
}

const lintCall = function lintCall(job: Job): ToolCall {
    const args = [
        ...job.prefix,
        "lint",
        ...job.common,
        "--format",
        "json",
        "--write-output",
        job.reportFile,
        ...job.files,
    ];
    return { args, bin: job.bin, cwd: job.advisory.root };
};

const lintSpec = function lintSpec(job: Job): ScanSpec {
    return {
        failed: failedOnStatus(FINDING_STATUSES),
        failure: (exit) =>
            toolFailure(
                job.advisory,
                toolErrorBecause(
                    TOOL,
                    exit.status,
                    "a bad dialect or config",
                    tailLines(exit.stderr, NO_STDERR_DETAIL),
                ),
            ),
        parse: () => parseSqlfluffOutput(readToolReport(job.reportFile), job.advisory.ecosystem),
    };
};

const applyFix = function applyFix(job: Job, reported: RunResult["findings"]): RunResult {
    const fixArgs = [...job.prefix, "fix", ...job.common, "--disable-progress-bar", ...job.files];
    const fixed = spawnTool(job.bin, fixArgs, { cwd: job.advisory.root, encoding: "utf8", shell: false });
    if (fixed.error) {
        return findingsResult(reported);
    }
    if (signalKilled(fixed.status)) {
        return signalDeathResult(job.advisory, fixed.signal);
    }
    const call = lintCall(job);
    const after = spawnTool(call.bin, call.args, { cwd: call.cwd, encoding: "utf8", shell: false });
    if (signalKilled(after.status)) {
        return signalDeathResult(job.advisory, after.signal);
    }
    if (!statusIn(FINDING_STATUSES, after.status)) {
        return findingsResult(reported);
    }
    return fixedResult(reported, parseSqlfluffOutput(readToolReport(job.reportFile), job.advisory.ecosystem));
};

const runSqlfluff = async function runSqlfluff(context: RunnerContext): Promise<RunResult> {
    const files = await scopedFiles(context.root, context.paths);
    if (files.length === 0) {
        return EMPTY_RESULT;
    }
    const { command, dialect } = await toolSetting(context.root, TOOL, DEFAULTS);
    const configFile = writeToolFile(
        context.root,
        CONFIG_FILE,
        await nativeToolConfig(context.root, LANGUAGE, CONFIG_FILE),
    );
    const { bin, prefix } = commandOf(command, TOOL);
    const job: Job = {
        advisory: gatingAdvisory(context, TOOL, commandHint(TOOL, bin)),
        bin,
        common: ["--config", configFile, "--dialect", dialect],
        files,
        prefix,
        reportFile: freshToolFile(context.root, REPORT_FILE),
    };
    return fixCycle(
        passTool(job.advisory, lintCall(job), lintSpec(job)),
        (findings) => context.fix && findings.some((finding) => finding.fixable),
        (reported) => applyFix(job, reported),
    );
};

defineTool({ ecosystems: [LANGUAGE], run: runSqlfluff, tool: TOOL });
