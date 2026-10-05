import { commandHint, semgrepFailed } from "#configuration/strings/tool.strings";
import { messageScan, scanTool } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { SUCCESS_STATUSES } from "#configuration/constants/tool.constants";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseSemgrepOutput } from "#core/parsers/tool.semgrep.parser";
import { toolAdvisory } from "#core/factories/tool.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "semgrep";
const DEFAULTS = { command: TOOL, config: "" };

const runSemgrep = async function runSemgrep(context: RunnerContext): Promise<RunResult> {
    const { command, config } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, TOOL);
    const advisory = toolAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec = messageScan(
        advisory,
        SUCCESS_STATUSES,
        (result) => parseSemgrepOutput(result.stdout, context.ecosystem),
        (exit) => semgrepFailed(exit.status, exitDetail(exit)),
    );
    const configArgs = config.length > 0 ? ["--config", config] : [];
    return scanTool(
        advisory,
        { args: [...prefix, ...configArgs, "--json", "--quiet", ...context.paths], bin, cwd: context.root },
        spec,
    );
};

defineTool({ ecosystems: ["csharp"], run: runSemgrep, tool: TOOL });
