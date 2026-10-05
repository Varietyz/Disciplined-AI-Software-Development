import type { RunnerContext, ScanSpec } from "#types/tool.types";
import { commandHint, incompleteScan } from "#configuration/strings/tool.strings";
import { freshToolFile, readToolReport } from "#core/persistence/tool.persistence";
import { parseSlitherReport, slitherSucceeded } from "#core/parsers/tool.slither.parser";
import type { RunResult } from "#types/finding.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { scanTool } from "#core/adapters/tool.adapter";
import { toolAdvisory } from "#core/factories/tool.factory";
import { toolFailure } from "#core/factories/finding.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "slither";
const DEFAULTS = { command: TOOL, solc: "" };
const REPORT_FILE = "slither.json";

const runSlither = async function runSlither(context: RunnerContext): Promise<RunResult> {
    const { command, solc } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, TOOL);
    const reportFile = freshToolFile(context.root, REPORT_FILE);
    const advisory = toolAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec: ScanSpec = {
        failed: () => !slitherSucceeded(readToolReport(reportFile)),
        failure: (exit) => toolFailure(advisory, incompleteScan(TOOL, "a compilation/solc error", exitDetail(exit))),
        parse: () => parseSlitherReport(readToolReport(reportFile), context.ecosystem),
    };
    const args = [...prefix, ...context.paths, ...(solc.length > 0 ? ["--solc", solc] : []), "--json", reportFile];
    return scanTool(advisory, { args, bin, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["solidity"], run: runSlither, tool: TOOL });
