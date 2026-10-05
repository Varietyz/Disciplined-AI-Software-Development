import type { RunnerContext, ScanSpec, ToolSpawn } from "#types/tool.types";
import { passTool, scanTargets } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { failedWhenEmpty } from "#core/classifiers/invocation.classifier";
import { installHint } from "#configuration/strings/tool.strings";
import { parseBrakemanOutput } from "#core/parsers/tool.brakeman.parser";
import { scopeTargets } from "#core/resolvers/scope.resolver";
import { toolAdvisory } from "#core/factories/tool.factory";
import { toolError } from "#core/factories/finding.factory";

const TOOL = "brakeman";
const NO_WARNINGS_EXIT = 3;
const OK_STATUSES: ReadonlySet<number> = new Set([0, NO_WARNINGS_EXIT]);
const NOT_RAILS_NOTICE = "supply the path to a Rails application";

const isRailsless = function isRailsless(result: ToolSpawn): boolean {
    return `${result.stdout}${result.stderr}`.includes(NOT_RAILS_NOTICE);
};

const runBrakeman = function runBrakeman(context: RunnerContext): RunResult {
    const advisory = toolAdvisory(context, TOOL, installHint(TOOL));
    const emptyFailure = failedWhenEmpty(OK_STATUSES);
    const spec: ScanSpec = {
        failed: (result, findings) => !isRailsless(result) && emptyFailure(result, findings),
        failure: (exit) => toolError(advisory, exit),
        parse: (result) => (isRailsless(result) ? [] : parseBrakemanOutput(result.stdout, context.ecosystem)),
    };
    return scanTargets(scopeTargets(context.root, context.paths), (target) =>
        passTool(advisory, { args: ["-f", "json", "-q", target], bin: TOOL, cwd: context.root }, spec),
    );
};

defineTool({ ecosystems: ["ruby"], run: runBrakeman, tool: TOOL });
