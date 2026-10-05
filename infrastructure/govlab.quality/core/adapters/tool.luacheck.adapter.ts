import { installHint, toolErrorMessage } from "#configuration/strings/tool.strings";
import { messageScan, scanTool } from "#core/adapters/tool.adapter";
import { FINDING_STATUSES } from "#configuration/constants/tool.constants";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseLuacheckOutput } from "#core/parsers/tool.luacheck.parser";
import { toolAdvisory } from "#core/factories/tool.factory";

const TOOL = "luacheck";

const runLuacheck = function runLuacheck(context: RunnerContext): RunResult {
    const advisory = toolAdvisory(context, TOOL, installHint(TOOL));
    const spec = messageScan(
        advisory,
        FINDING_STATUSES,
        (result) => parseLuacheckOutput(result.stdout, context.ecosystem),
        (exit) => toolErrorMessage(TOOL, exit.status, exitDetail(exit)),
    );
    return scanTool(
        advisory,
        { args: ["--formatter", "plain", "--codes", ...context.paths], bin: TOOL, cwd: context.root },
        spec,
    );
};

defineTool({ ecosystems: ["lua"], run: runLuacheck, tool: TOOL });
