import { scanTool, standardScan } from "#core/adapters/tool.adapter";
import { FINDING_STATUSES } from "#configuration/constants/tool.constants";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { defineTool } from "#core/registries/tool.registry";
import { installHint } from "#configuration/strings/tool.strings";
import { parseActionlintOutput } from "#core/parsers/tool.actionlint.parser";
import { toolAdvisory } from "#core/factories/tool.factory";

const TOOL = "actionlint";
const JSON_FORMAT = "{{json .}}";

const runActionlint = function runActionlint(context: RunnerContext): RunResult {
    const advisory = toolAdvisory(context, TOOL, installHint(TOOL));
    const call = { args: ["-format", JSON_FORMAT, ...context.paths], bin: TOOL, cwd: context.root };
    return scanTool(
        advisory,
        call,
        standardScan(advisory, FINDING_STATUSES, (result) => parseActionlintOutput(result.stdout, context.ecosystem)),
    );
};

defineTool({ ecosystems: ["actions"], run: runActionlint, tool: TOOL });
