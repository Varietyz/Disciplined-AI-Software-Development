import type { RunnerContext, ScanSpec } from "#types/tool.types";
import { commandHint, incompleteScan } from "#configuration/strings/tool.strings";
import { freshToolFile, readToolReport, toolCacheRelative } from "#core/persistence/tool.persistence";
import type { RunResult } from "#types/finding.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseKicsReport } from "#core/parsers/tool.kics.parser";
import { scanTool } from "#core/adapters/tool.adapter";
import { toolAdvisory } from "#core/factories/tool.factory";
import { toolFailure } from "#core/factories/finding.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "kics";
const DEFAULTS = { command: TOOL, libraries: "", queries: "" };
const REPORT_NAME = "kics";
const REPORT_EXTENSION = ".json";

const scanArgs = function scanArgs(paths: readonly string[], setting: typeof DEFAULTS): string[] {
    return [
        "scan",
        ...paths.flatMap((target) => ["-p", target]),
        ...(setting.queries.length > 0 ? ["-q", setting.queries] : []),
        ...(setting.libraries.length > 0 ? ["--libraries-path", setting.libraries] : []),
        "--report-formats",
        "json",
        "-o",
        toolCacheRelative(),
        "--output-name",
        REPORT_NAME,
        "--no-progress",
        "--ci",
    ];
};

const runKics = async function runKics(context: RunnerContext): Promise<RunResult> {
    const setting = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(setting.command, TOOL);
    const reportFile = freshToolFile(context.root, `${REPORT_NAME}${REPORT_EXTENSION}`);
    const advisory = toolAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec: ScanSpec = {
        failed: () => readToolReport(reportFile).length === 0,
        failure: (exit) =>
            toolFailure(
                advisory,
                incompleteScan(TOOL, "a missing query library or an unreadable path", exitDetail(exit)),
            ),
        parse: () => parseKicsReport(readToolReport(reportFile), context.ecosystem),
    };
    return scanTool(advisory, { args: [...prefix, ...scanArgs(context.paths, setting)], bin, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["ansible"], run: runKics, tool: TOOL });
