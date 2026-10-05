import type { AdvisoryToolSpec, RunnerContext } from "#types/tool.types";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { parseMadgeOutput } from "#core/parsers/tool.madge.parser";
import { runAdvisory } from "#core/adapters/tool.adapter";

const TOOL = "madge";

const MADGE_SPEC: AdvisoryToolSpec = {
    argsFor: (context) => ["--circular", "--json", ...context.paths],
    cwdFor: (context) => context.root,
    parse: parseMadgeOutput,
    statusOk: () => true,
    tool: TOOL,
};

const runMadge = function runMadge(context: RunnerContext): RunResult {
    return runAdvisory(MADGE_SPEC, context);
};

defineTool({ ecosystems: ["javascript", "typescript"], run: runMadge, tool: TOOL });
