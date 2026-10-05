import type { AdvisoryToolSpec, RunnerContext } from "#types/tool.types";
import { NPM_MANIFEST } from "#configuration/constants/tool.constants";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { parseDepcheckOutput } from "#core/parsers/tool.depcheck.parser";
import { projectDirWithMarker } from "#core/resolvers/scope.resolver";
import { runAdvisory } from "#core/adapters/tool.adapter";

const TOOL = "depcheck";

const DEPCHECK_SPEC: AdvisoryToolSpec = {
    argsFor: () => ["--json"],
    cwdFor: (context) => projectDirWithMarker(context.root, context.paths, NPM_MANIFEST),
    parse: parseDepcheckOutput,
    statusOk: () => true,
    tool: TOOL,
};

const runDepcheck = function runDepcheck(context: RunnerContext): RunResult {
    return runAdvisory(DEPCHECK_SPEC, context);
};

defineTool({ ecosystems: ["javascript", "typescript"], run: runDepcheck, tool: TOOL });
