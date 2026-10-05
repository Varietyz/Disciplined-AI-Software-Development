import { passTool, scanTargets, standardScan } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { SUCCESS_STATUSES } from "#configuration/constants/tool.constants";
import { defineTool } from "#core/registries/tool.registry";
import { installHint } from "#configuration/strings/tool.strings";
import { parseTrivyOutput } from "#core/parsers/tool.trivy.parser";
import { scopeTargets } from "#core/resolvers/scope.resolver";
import { toolAdvisory } from "#core/factories/tool.factory";

const TOOL = "trivy";

const runTrivy = function runTrivy(context: RunnerContext): RunResult {
    const advisory = toolAdvisory(context, TOOL, installHint(TOOL));
    const spec = standardScan(advisory, SUCCESS_STATUSES, (result) =>
        parseTrivyOutput(result.stdout, context.ecosystem),
    );
    return scanTargets(scopeTargets(context.root, context.paths), (target) =>
        passTool(advisory, { args: ["config", "-f", "json", "--quiet", target], bin: TOOL, cwd: context.root }, spec),
    );
};

defineTool({ ecosystems: ["iac"], run: runTrivy, tool: TOOL });
