import { NO_STDERR_DETAIL, installHint, toolErrorBecause } from "#configuration/strings/tool.strings";
import { messageScan, scanTool } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { defineTool } from "#core/registries/tool.registry";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { parsePhpmdOutput } from "#core/parsers/tool.phpmd.parser";
import { stringArrayFieldOr } from "#core/selectors/record.selector";
import { tailLines } from "#core/selectors/failure.selector";
import { toolSection } from "#core/resolvers/tool.resolver";

const TOOL = "phpmd";
const VIOLATIONS_EXIT = 2;
const OK_STATUSES: ReadonlySet<number> = new Set([0, VIOLATIONS_EXIT]);
const DEFAULT_RULESETS = ["codesize", "design", "unusedcode", "naming"];

const runPhpmd = async function runPhpmd(context: RunnerContext): Promise<RunResult> {
    const rulesets = stringArrayFieldOr(await toolSection(context.root, TOOL), "rulesets", DEFAULT_RULESETS);
    const advisory = gatingAdvisory(context, TOOL, installHint(TOOL));
    const spec = messageScan(
        advisory,
        OK_STATUSES,
        (result) => parsePhpmdOutput(result.stdout, context.ecosystem),
        (exit) => toolErrorBecause(TOOL, exit.status, "a bad ruleset", tailLines(exit.stderr, NO_STDERR_DETAIL)),
    );
    const args = [context.paths.join(","), "json", (rulesets.length > 0 ? rulesets : DEFAULT_RULESETS).join(",")];
    return scanTool(advisory, { args, bin: TOOL, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["php"], run: runPhpmd, tool: TOOL });
