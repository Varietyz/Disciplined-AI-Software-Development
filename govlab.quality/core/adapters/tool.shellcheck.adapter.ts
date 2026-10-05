import { boolField, stringArrayField, stringField } from "#core/selectors/record.selector";
import { scanTool, standardScan } from "#core/adapters/tool.adapter";
import { EMPTY_RESULT } from "#core/factories/finding.factory";
import { FINDING_STATUSES } from "#configuration/constants/tool.constants";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { defineTool } from "#core/registries/tool.registry";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { installHint } from "#configuration/strings/tool.strings";
import { parseShellcheckOutput } from "#core/parsers/tool.shellcheck.parser";
import { scopedFiles } from "#core/resolvers/scope.resolver";
import { toolSection } from "#core/resolvers/tool.resolver";

const TOOL = "shellcheck";

export const shellcheckFlags = function shellcheckFlags(section: Record<string, unknown>): string[] {
    const severity = stringField(section, "severity");
    const exclude = stringArrayField(section, "exclude");
    return [
        ...(boolField(section, "enableAll") ? ["--enable=all"] : []),
        ...(severity.length > 0 ? [`--severity=${severity}`] : []),
        ...(exclude.length > 0 ? [`--exclude=${exclude.join(",")}`] : []),
    ];
};

const runShellcheck = async function runShellcheck(context: RunnerContext): Promise<RunResult> {
    const files = await scopedFiles(context.root, context.paths);
    if (files.length === 0) {
        return EMPTY_RESULT;
    }
    const flags = shellcheckFlags(await toolSection(context.root, TOOL));
    const advisory = gatingAdvisory(context, TOOL, installHint(TOOL));
    const spec = standardScan(advisory, FINDING_STATUSES, (result) =>
        parseShellcheckOutput(result.stdout, context.ecosystem),
    );
    return scanTool(advisory, { args: ["-f", "json", ...flags, ...files], bin: TOOL, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["shell"], run: runShellcheck, tool: TOOL });
