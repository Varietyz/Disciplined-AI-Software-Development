import { scanTool, standardScan } from "#core/adapters/tool.adapter";
import { stringArrayField, stringField } from "#core/selectors/record.selector";
import { FINDING_STATUSES } from "#configuration/constants/tool.constants";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { defineTool } from "#core/registries/tool.registry";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { installHint } from "#configuration/strings/tool.strings";
import { parseHadolintOutput } from "#core/parsers/tool.hadolint.parser";
import { toolSection } from "#core/resolvers/tool.resolver";

const TOOL = "hadolint";

export const hadolintFlags = function hadolintFlags(section: Record<string, unknown>): string[] {
    const threshold = stringField(section, "failureThreshold");
    return [
        ...(threshold.length > 0 ? ["--failure-threshold", threshold] : []),
        ...stringArrayField(section, "ignore").flatMap((rule) => ["--ignore", rule]),
    ];
};

const runHadolint = async function runHadolint(context: RunnerContext): Promise<RunResult> {
    const flags = hadolintFlags(await toolSection(context.root, TOOL));
    const advisory = gatingAdvisory(context, TOOL, installHint(TOOL));
    const spec = standardScan(advisory, FINDING_STATUSES, (result) =>
        parseHadolintOutput(result.stdout, context.ecosystem),
    );
    return scanTool(advisory, { args: ["-f", "json", ...flags, ...context.paths], bin: TOOL, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["dockerfile"], run: runHadolint, tool: TOOL });
