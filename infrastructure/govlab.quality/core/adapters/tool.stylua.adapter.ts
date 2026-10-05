import type { RunnerContext, ScanSpec, ToolCall } from "#types/tool.types";
import { findingsResult, signalDeathResult, toolError } from "#core/factories/finding.factory";
import { fixCycle, passTool, residualOf } from "#core/adapters/tool.adapter";
import { parseStyluaCheck, unformattedFinding } from "#core/parsers/tool.stylua.parser";
import { FINDING_STATUSES } from "#configuration/constants/tool.constants";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { failedOnStatus } from "#core/classifiers/invocation.classifier";
import { installHint } from "#configuration/strings/tool.strings";
import { quietGatingAdvisory } from "#core/factories/tool.factory";
import { signalKilled } from "#core/predicates/failure.predicate";
import { spawnTool } from "#core/adapters/invocation.adapter";
import { toolSection } from "#core/resolvers/tool.resolver";

const TOOL = "stylua";
const FLAGS: readonly (readonly [string, string, "number" | "string"])[] = [
    ["indentType", "--indent-type", "string"],
    ["indentWidth", "--indent-width", "number"],
    ["quoteStyle", "--quote-style", "string"],
    ["columnWidth", "--column-width", "number"],
];

export const styluaFlags = function styluaFlags(section: Record<string, unknown>): string[] {
    return FLAGS.flatMap(([key, flag, kind]) => {
        const value = section[key];
        return typeof value === kind && (typeof value === "string" || typeof value === "number")
            ? [flag, String(value)]
            : [];
    });
};

const runStylua = async function runStylua(context: RunnerContext): Promise<RunResult> {
    const flags = styluaFlags(await toolSection(context.root, TOOL));
    const advisory = quietGatingAdvisory(context, TOOL, installHint(TOOL));
    const check: ToolCall = { args: ["--check", ...flags, ...context.paths], bin: TOOL, cwd: context.root };
    const spec: ScanSpec = {
        failed: failedOnStatus(FINDING_STATUSES),
        failure: (exit) => toolError(advisory, exit),
        parse: (result) => parseStyluaCheck(result.stdout).map((file) => unformattedFinding(file, context.ecosystem)),
    };
    return fixCycle(
        passTool(advisory, check, spec),
        (findings) => context.fix && findings.length > 0,
        (reported) => {
            const formatted = spawnTool(TOOL, [...flags, ...context.paths], {
                cwd: context.root,
                encoding: "utf8",
                shell: false,
            });
            if (formatted.error) {
                return findingsResult(reported);
            }
            if (signalKilled(formatted.status)) {
                return signalDeathResult(advisory, formatted.signal);
            }
            return residualOf(reported, passTool(advisory, check, spec));
        },
    );
};

defineTool({ ecosystems: ["lua"], run: runStylua, tool: TOOL });
