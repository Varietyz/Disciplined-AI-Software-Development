import type { AdvisoryContext, RunnerContext } from "#types/tool.types";
import { scanTool, standardScan } from "#core/adapters/tool.adapter";
import { FINDING_STATUSES } from "#configuration/constants/tool.constants";
import type { RunResult } from "#types/finding.types";
import { commandHint } from "#configuration/strings/tool.strings";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { parseBanditOutput } from "#core/parsers/tool.bandit.parser";
import { toolAdvisory } from "#core/factories/tool.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "bandit";
const DEFAULTS = { command: "python -m bandit" };

const runBandit = async function runBandit(context: RunnerContext): Promise<RunResult> {
    const { command } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, TOOL);
    const advisory: AdvisoryContext = {
        ...toolAdvisory(context, TOOL, commandHint(TOOL, bin)),
        failureSeverity: "error",
    };
    const spec = standardScan(advisory, FINDING_STATUSES, (result) =>
        parseBanditOutput(result.stdout, context.ecosystem),
    );
    return scanTool(
        advisory,
        { args: [...prefix, "-r", "-f", "json", ...context.paths], bin, cwd: context.root },
        spec,
    );
};

defineTool({ ecosystems: ["python"], run: runBandit, tool: TOOL });
