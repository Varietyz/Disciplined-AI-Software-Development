import type { AdvisoryContext, RunnerContext } from "#types/tool.types";
import { FINDING_STATUSES, GO_MODULE } from "#configuration/constants/tool.constants";
import { scanTool, standardScan } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { installHint } from "#configuration/strings/tool.strings";
import { parseGosecOutput } from "#core/parsers/tool.gosec.parser";
import { projectDirWithMarker } from "#core/resolvers/scope.resolver";
import { toolAdvisory } from "#core/factories/tool.factory";

const TOOL = "gosec";

const runGosec = function runGosec(context: RunnerContext): RunResult {
    const advisory: AdvisoryContext = { ...toolAdvisory(context, TOOL, installHint(TOOL)), failureSeverity: "error" };
    const cwd = projectDirWithMarker(context.root, context.paths, GO_MODULE);
    const spec = standardScan(advisory, FINDING_STATUSES, (result) =>
        parseGosecOutput(result.stdout, context.ecosystem),
    );
    return scanTool(advisory, { args: ["-fmt", "json", "./..."], bin: TOOL, cwd }, spec);
};

defineTool({ ecosystems: ["go"], run: runGosec, tool: TOOL });
