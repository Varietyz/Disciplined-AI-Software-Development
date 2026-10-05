import { NO_STDERR_DETAIL, installHint, toolErrorBecause } from "#configuration/strings/tool.strings";
import type { RunnerContext, ScanSpec, ToolCall } from "#types/tool.types";
import { findingsResult, signalDeathResult } from "#core/factories/finding.factory";
import { fixCycle, messageScan, passTool, residualOf } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { parsePhpcsOutput } from "#core/parsers/tool.phpcs.parser";
import { signalKilled } from "#core/predicates/failure.predicate";
import { spawnTool } from "#core/adapters/invocation.adapter";
import { stringField } from "#core/selectors/record.selector";
import { tailLines } from "#core/selectors/failure.selector";
import { toolSection } from "#core/resolvers/tool.resolver";

const TOOL = "phpcs";
const FIXER = "phpcbf";
const DEFAULT_STANDARD = "PSR12";
const ERRORS_FOUND_EXIT = 2;
const OK_STATUSES: ReadonlySet<number> = new Set([0, 1, ERRORS_FOUND_EXIT]);

const runPhpcs = async function runPhpcs(context: RunnerContext): Promise<RunResult> {
    const flags = [`--standard=${stringField(await toolSection(context.root, TOOL), "standard", DEFAULT_STANDARD)}`];
    const advisory = gatingAdvisory(context, TOOL, installHint(TOOL));
    const parse: ScanSpec["parse"] = (result) => parsePhpcsOutput(result.stdout, context.ecosystem);
    const report = messageScan(advisory, OK_STATUSES, parse, (exit) =>
        toolErrorBecause(TOOL, exit.status, "a bad standard", tailLines(exit.stderr, NO_STDERR_DETAIL)),
    );
    const call: ToolCall = { args: ["--report=json", ...flags, ...context.paths], bin: TOOL, cwd: context.root };
    return fixCycle(
        passTool(advisory, call, report),
        (findings) => context.fix && findings.some((finding) => finding.fixable),
        (reported) => {
            const fixed = spawnTool(FIXER, [...flags, ...context.paths], {
                cwd: context.root,
                encoding: "utf8",
                shell: false,
            });
            if (fixed.error) {
                return findingsResult(reported);
            }
            if (signalKilled(fixed.status)) {
                return signalDeathResult(advisory, fixed.signal);
            }
            return residualOf(reported, passTool(advisory, call, { ...report, failed: () => false }));
        },
    );
};

defineTool({ ecosystems: ["php"], run: runPhpcs, tool: TOOL });
