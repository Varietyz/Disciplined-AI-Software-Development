import type { AdvisoryToolSpec, RunnerContext } from "#types/tool.types";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { parseTsPruneOutput } from "#core/parsers/tool.ts-prune.parser";
import { runAdvisory } from "#core/adapters/tool.adapter";

const TOOL = "ts-prune";

const TS_PRUNE_SPEC: AdvisoryToolSpec = {
    argsFor: () => [],
    cwdFor: (context) => context.root,
    parse: parseTsPruneOutput,
    statusOk: () => true,
    tool: TOOL,
};

const runTsPrune = function runTsPrune(context: RunnerContext): RunResult {
    return runAdvisory(TS_PRUNE_SPEC, context);
};

defineTool({ ecosystems: ["typescript"], run: runTsPrune, tool: TOOL });
