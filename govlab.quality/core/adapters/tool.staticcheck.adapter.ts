import type { AdvisoryToolSpec, RunnerContext } from "#types/tool.types";
import { FINDING_STATUSES, GO_MODULE } from "#configuration/constants/tool.constants";
import { runAdvisory, statusOkIn } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { parseStaticcheckOutput } from "#core/parsers/tool.staticcheck.parser";
import { projectDirWithMarker } from "#core/resolvers/scope.resolver";

const TOOL = "staticcheck";

const STATICCHECK_SPEC: AdvisoryToolSpec = {
    argsFor: () => ["-f", "json", "./..."],
    cwdFor: (context) => projectDirWithMarker(context.root, context.paths, GO_MODULE),
    parse: parseStaticcheckOutput,
    statusOk: statusOkIn(FINDING_STATUSES),
    tool: TOOL,
};

const runStaticcheck = function runStaticcheck(context: RunnerContext): RunResult {
    return runAdvisory(STATICCHECK_SPEC, context);
};

defineTool({ ecosystems: ["go"], run: runStaticcheck, tool: TOOL });
