import { commandHint, toolErrorMessage } from "#configuration/strings/tool.strings";
import { messageScan, scanTool } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { SUCCESS_STATUSES } from "#configuration/constants/tool.constants";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseSarifReport } from "#core/parsers/report.parser";
import { quietGatingAdvisory } from "#core/factories/tool.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "checkstyle";
const DEFAULTS = { command: "java -jar checkstyle.jar", config: "/google_checks.xml" };

const runCheckstyle = async function runCheckstyle(context: RunnerContext): Promise<RunResult> {
    const { command, config } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, TOOL);
    const advisory = quietGatingAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec = messageScan(
        advisory,
        SUCCESS_STATUSES,
        (result) => parseSarifReport(result.stdout, context.ecosystem, TOOL),
        (exit) => toolErrorMessage(TOOL, exit.status, exitDetail(exit)),
    );
    return scanTool(
        advisory,
        { args: [...prefix, "-c", config, "-f", "sarif", ...context.paths], bin, cwd: context.root },
        spec,
    );
};

defineTool({ ecosystems: ["java"], run: runCheckstyle, tool: TOOL });
