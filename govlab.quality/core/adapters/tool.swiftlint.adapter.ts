import type { RunnerContext, ScanSpec } from "#types/tool.types";
import { commandHint, toolErrorMessage } from "#configuration/strings/tool.strings";
import { nativeToolConfig, toolSetting } from "#core/resolvers/tool.resolver";
import { toolCacheRelative, writeToolFile } from "#core/persistence/tool.persistence";
import type { RunResult } from "#types/finding.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseSwiftlintOutput } from "#core/parsers/tool.swiftlint.parser";
import { quietGatingAdvisory } from "#core/factories/tool.factory";
import { scanTool } from "#core/adapters/tool.adapter";
import { toolFailure } from "#core/factories/finding.factory";

const TOOL = "swiftlint";
const LANGUAGE = "swift";
const PROFILE_FILE = ".swiftlint.yml";
const DEFAULTS = { command: TOOL };
const ARRAY_OPEN = "[";

const runSwiftlint = async function runSwiftlint(context: RunnerContext): Promise<RunResult> {
    const { command } = await toolSetting(context.root, TOOL, DEFAULTS);
    writeToolFile(context.root, PROFILE_FILE, await nativeToolConfig(context.root, LANGUAGE, PROFILE_FILE));
    const { bin, prefix } = commandOf(command, TOOL);
    const advisory = quietGatingAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec: ScanSpec = {
        failed: (result, findings) =>
            findings.length === 0 && !result.stdout.trim().startsWith(ARRAY_OPEN) && (result.status ?? 0) !== 0,
        failure: (exit) => toolFailure(advisory, toolErrorMessage(TOOL, exit.status, exitDetail(exit))),
        parse: (result) => parseSwiftlintOutput(result.stdout.trim(), context.ecosystem),
    };
    const args = [
        ...prefix,
        "lint",
        "--config",
        toolCacheRelative(PROFILE_FILE),
        "--reporter",
        "json",
        "--no-cache",
        ...context.paths,
    ];
    return scanTool(advisory, { args, bin, cwd: context.root }, spec);
};

defineTool({ ecosystems: [LANGUAGE], run: runSwiftlint, tool: TOOL });
