import { commandHint, toolErrorMessage } from "#configuration/strings/tool.strings";
import { freshToolFile, readToolReport } from "#core/persistence/tool.persistence";
import { messageScan, scanTool } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseSarifReport } from "#core/parsers/report.parser";
import { quietGatingAdvisory } from "#core/factories/tool.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "detekt";
const DEFAULTS = { command: "java -jar detekt-cli-all.jar", config: "" };
const REPORT_FILE = "detekt.sarif";
const ISSUES_EXIT = 2;
const OK_STATUSES: ReadonlySet<number> = new Set([0, ISSUES_EXIT]);

const runDetekt = async function runDetekt(context: RunnerContext): Promise<RunResult> {
    const { command, config } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, TOOL);
    const reportFile = freshToolFile(context.root, REPORT_FILE);
    const advisory = quietGatingAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec = messageScan(
        advisory,
        OK_STATUSES,
        () => parseSarifReport(readToolReport(reportFile), context.ecosystem, TOOL),
        (exit) => toolErrorMessage(TOOL, exit.status, exitDetail(exit)),
    );
    const configArgs = config.length > 0 ? ["--config", config] : [];
    const args = [...prefix, ...configArgs, "--input", context.paths.join(","), "--report", `sarif:${reportFile}`];
    return scanTool(advisory, { args, bin, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["kotlin"], run: runDetekt, tool: TOOL });
