import type { AdvisoryToolSpec, RunnerContext } from "#types/tool.types";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { parseDependencyCruiserOutput } from "#core/parsers/tool.dependency-cruiser.parser";
import { runAdvisory } from "#core/adapters/tool.adapter";

const TOOL = "dependency-cruiser";
const BIN = "depcruise";

const DEPENDENCY_CRUISER_SPEC: AdvisoryToolSpec = {
    argsFor: (context) => ["--output-type", "json", ...context.paths],
    cwdFor: (context) => context.root,
    parse: parseDependencyCruiserOutput,
    statusOk: () => true,
    tool: BIN,
};

const runDependencyCruiser = function runDependencyCruiser(context: RunnerContext): RunResult {
    return runAdvisory(DEPENDENCY_CRUISER_SPEC, context);
};

defineTool({ ecosystems: ["javascript", "typescript"], run: runDependencyCruiser, tool: TOOL });
