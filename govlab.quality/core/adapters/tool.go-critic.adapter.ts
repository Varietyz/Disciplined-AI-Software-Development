import type { AdvisoryToolSpec, RunnerContext } from "#types/tool.types";
import { FINDING_STATUSES, GO_MODULE } from "#configuration/constants/tool.constants";
import { runAdvisory, statusOkIn } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { parseGoCriticOutput } from "#core/parsers/tool.go-critic.parser";
import { projectDirWithMarker } from "#core/resolvers/scope.resolver";

const TOOL = "go-critic";
const BIN = "gocritic";

const GO_CRITIC_SPEC: AdvisoryToolSpec = {
    argsFor: () => ["check", "./..."],
    cwdFor: (context) => projectDirWithMarker(context.root, context.paths, GO_MODULE),
    parse: parseGoCriticOutput,
    statusOk: statusOkIn(FINDING_STATUSES),
    stream: "stderr",
    tool: BIN,
};

const runGoCritic = function runGoCritic(context: RunnerContext): RunResult {
    return runAdvisory(GO_CRITIC_SPEC, context);
};

defineTool({ ecosystems: ["go"], run: runGoCritic, tool: TOOL });
