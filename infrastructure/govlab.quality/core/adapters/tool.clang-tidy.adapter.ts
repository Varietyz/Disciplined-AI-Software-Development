import type { AdvisoryContext, RunnerContext } from "#types/tool.types";
import { installHint, notInstalledOutput } from "#configuration/strings/tool.strings";
import { scanTool, standardScan } from "#core/adapters/tool.adapter";
import { stringArrayFieldOr, stringField } from "#core/selectors/record.selector";
import type { RunResult } from "#types/finding.types";
import { SUCCESS_STATUSES } from "#configuration/constants/tool.constants";
import { defineTool } from "#core/registries/tool.registry";
import { parseClangTidyOutput } from "#core/parsers/tool.clang-tidy.parser";
import { toolAdvisory } from "#core/factories/tool.factory";
import { toolSection } from "#core/resolvers/tool.resolver";

const TOOL = "clang-tidy";
const DEFAULT_CHECKS = "clang-analyzer-*,bugprone-*,modernize-*,performance-*";
const DEFAULT_COMPILER_ARGS = ["-std=c++17"];

const runClangTidy = async function runClangTidy(context: RunnerContext): Promise<RunResult> {
    const section = await toolSection(context.root, TOOL);
    const checks = stringField(section, "checks", DEFAULT_CHECKS);
    const compilerArgs = stringArrayFieldOr(section, "compilerArgs", DEFAULT_COMPILER_ARGS);
    const advisory: AdvisoryContext = {
        ...toolAdvisory(context, TOOL, installHint(TOOL)),
        notInstalledOutput: notInstalledOutput(TOOL),
    };
    const spec = standardScan(advisory, SUCCESS_STATUSES, (result) =>
        parseClangTidyOutput(result.stdout, context.ecosystem),
    );
    const args = [`--checks=${checks}`, "--quiet", ...context.paths, "--", ...compilerArgs];
    return scanTool(advisory, { args, bin: TOOL, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["cpp"], run: runClangTidy, tool: TOOL });
