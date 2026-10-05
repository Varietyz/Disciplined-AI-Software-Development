import { NO_ERROR_DETAIL, installHint, toolErrorMessage } from "#configuration/strings/tool.strings";
import { messageScan, passTool, scanTargets } from "#core/adapters/tool.adapter";
import { parseTflintOutput, tflintErrorDetail } from "#core/parsers/tool.tflint.parser";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { defineTool } from "#core/registries/tool.registry";
import { scopeTargets } from "#core/resolvers/scope.resolver";
import { tailLines } from "#core/selectors/failure.selector";
import { toolAdvisory } from "#core/factories/tool.factory";

const TOOL = "tflint";
const ISSUES_FOUND_EXIT = 2;
const OK_STATUSES: ReadonlySet<number> = new Set([0, ISSUES_FOUND_EXIT]);

const runTflint = function runTflint(context: RunnerContext): RunResult {
    const advisory = toolAdvisory(context, TOOL, installHint(TOOL));
    const spec = messageScan(
        advisory,
        OK_STATUSES,
        (result) => parseTflintOutput(result.stdout, context.ecosystem),
        (exit) =>
            toolErrorMessage(
                TOOL,
                exit.status,
                tailLines(tflintErrorDetail(exit.stdout, exit.stderr), NO_ERROR_DETAIL),
            ),
    );
    return scanTargets(scopeTargets(context.root, context.paths), (target) =>
        passTool(advisory, { args: ["--format", "json", `--chdir=${target}`], bin: TOOL, cwd: context.root }, spec),
    );
};

defineTool({ ecosystems: ["iac"], run: runTflint, tool: TOOL });
