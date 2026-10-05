import { PERLCRITIC_DELIMITER, parsePerlcriticOutput } from "#core/parsers/tool.perlcritic.parser";
import type { RunnerContext, ScanSpec } from "#types/tool.types";
import { commandHint, toolErrorMessage } from "#configuration/strings/tool.strings";
import { nativeToolConfig, toolSetting } from "#core/resolvers/tool.resolver";
import { toolCacheRelative, writeToolFile } from "#core/persistence/tool.persistence";
import type { RunResult } from "#types/finding.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { quietGatingAdvisory } from "#core/factories/tool.factory";
import { scanTool } from "#core/adapters/tool.adapter";
import { toolFailure } from "#core/factories/finding.factory";

const TOOL = "perlcritic";
const LANGUAGE = "perl";
const PROFILE_FILE = ".perlcriticrc";
const DEFAULTS = { command: TOOL, severity: "3" };
const VERBOSE_FORMAT = ["%f", "%l", "%c", "%s", "%p", "%m%n"].join(PERLCRITIC_DELIMITER);

const runPerlcritic = async function runPerlcritic(context: RunnerContext): Promise<RunResult> {
    const { command, severity } = await toolSetting(context.root, TOOL, DEFAULTS);
    writeToolFile(context.root, PROFILE_FILE, await nativeToolConfig(context.root, LANGUAGE, PROFILE_FILE));
    const { bin, prefix } = commandOf(command, TOOL);
    const advisory = quietGatingAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec: ScanSpec = {
        failed: (result, findings) => findings.length === 0 && (result.status ?? 0) !== 0,
        failure: (exit) => toolFailure(advisory, toolErrorMessage(TOOL, exit.status, exitDetail(exit))),
        parse: (result) => parsePerlcriticOutput(result.stdout, context.ecosystem),
    };
    const args = [
        ...prefix,
        "--profile",
        toolCacheRelative(PROFILE_FILE),
        "--severity",
        severity,
        "--verbose",
        VERBOSE_FORMAT,
        ...context.paths,
    ];
    return scanTool(advisory, { args, bin, cwd: context.root }, spec);
};

defineTool({ ecosystems: [LANGUAGE], run: runPerlcritic, tool: TOOL });
