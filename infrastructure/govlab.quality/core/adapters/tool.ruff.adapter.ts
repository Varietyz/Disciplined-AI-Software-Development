import type { AdvisoryContext, RunnerContext, ScanSpec, ToolCall } from "#types/tool.types";
import { NO_STDERR_DETAIL, installHint, toolErrorBecause } from "#configuration/strings/tool.strings";
import { fixCycle, passTool, residualOf } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { nativeToolConfig } from "#core/resolvers/tool.resolver";
import { parseRuffOutput } from "#core/parsers/tool.ruff.parser";
import { tailLines } from "#core/selectors/failure.selector";
import { toolFailure } from "#core/factories/finding.factory";
import { writeToolFile } from "#core/persistence/tool.persistence";

const TOOL = "ruff";
const LANGUAGE = "python";
const CONFIG_FILE = "ruff.toml";
const TOOL_ERROR = 2;

const ruffSpec = function ruffSpec(advisory: AdvisoryContext): ScanSpec {
    return {
        failed: (result) => result.status === TOOL_ERROR,
        failure: (exit) =>
            toolFailure(
                advisory,
                toolErrorBecause(
                    TOOL,
                    TOOL_ERROR,
                    "a malformed config or internal error",
                    tailLines(exit.stderr, NO_STDERR_DETAIL),
                ),
            ),
        parse: (result) => parseRuffOutput(result.stdout, advisory.ecosystem),
    };
};

const ruffCall = function ruffCall(context: RunnerContext, configFile: string, withFix: boolean): ToolCall {
    const args = [
        "check",
        "--config",
        configFile,
        "--output-format",
        "json",
        ...(withFix ? ["--fix"] : []),
        ...context.paths,
    ];
    return { args, bin: TOOL, cwd: context.root };
};

const runRuff = async function runRuff(context: RunnerContext): Promise<RunResult> {
    const configFile = writeToolFile(
        context.root,
        CONFIG_FILE,
        await nativeToolConfig(context.root, LANGUAGE, CONFIG_FILE),
    );
    const advisory = gatingAdvisory(context, TOOL, installHint(TOOL));
    const spec = ruffSpec(advisory);
    return fixCycle(
        passTool(advisory, ruffCall(context, configFile, false), spec),
        (findings) => context.fix && findings.length > 0,
        (reported) => residualOf(reported, passTool(advisory, ruffCall(context, configFile, true), spec)),
    );
};

defineTool({ ecosystems: [LANGUAGE], run: runRuff, tool: TOOL });
