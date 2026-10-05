import type { AdvisoryContext, RunnerContext, ScanSpec, ToolCall } from "#types/tool.types";
import { CARGO_MANIFEST, SUCCESS_STATUSES } from "#configuration/constants/tool.constants";
import { NO_STDERR_DETAIL, installHint, toolErrorBecause } from "#configuration/strings/tool.strings";
import { enabledToolRules, nativeToolConfig } from "#core/resolvers/tool.resolver";
import { failedOnStatus, failedWhenEmpty } from "#core/classifiers/invocation.classifier";
import { fixCycle, passTool, residualOf } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { parseClippyOutput } from "#core/parsers/tool.clippy.parser";
import path from "node:path";
import { projectDirWithMarker } from "#core/resolvers/scope.resolver";
import { tailLines } from "#core/selectors/failure.selector";
import { toolFailure } from "#core/factories/finding.factory";
import { writeToolFile } from "#core/persistence/tool.persistence";

const TOOL = "clippy";
const BIN = "cargo";
const LANGUAGE = "rust";
const CONFIG_FILE = "clippy.toml";
const CAUSE = "a malformed config or cargo error";

export const clippyArgs = function clippyArgs(lints: readonly string[], withFix: boolean): string[] {
    const fixArgs = withFix ? ["--fix", "--allow-dirty", "--allow-no-vcs"] : [];
    const lintArgs = lints.flatMap((lint) => ["-W", lint]);
    return ["clippy", ...fixArgs, "--message-format", "json", ...(lintArgs.length > 0 ? ["--", ...lintArgs] : [])];
};

const clippySpec = function clippySpec(advisory: AdvisoryContext, failed: ScanSpec["failed"]): ScanSpec {
    return {
        failed,
        failure: (exit) =>
            toolFailure(
                advisory,
                toolErrorBecause(`${BIN} ${TOOL}`, exit.status, CAUSE, tailLines(exit.stderr, NO_STDERR_DETAIL)),
            ),
        parse: (result) => parseClippyOutput(result.stdout, advisory.ecosystem),
    };
};

export const runClippy = async function runClippy(context: RunnerContext): Promise<RunResult> {
    const confFile = writeToolFile(
        context.root,
        CONFIG_FILE,
        await nativeToolConfig(context.root, LANGUAGE, CONFIG_FILE),
    );
    const lints = await enabledToolRules(context.root, LANGUAGE, TOOL);
    const advisory = gatingAdvisory(context, TOOL, installHint(TOOL));
    const call = (withFix: boolean): ToolCall => ({
        args: clippyArgs(lints, withFix),
        bin: BIN,
        cwd: projectDirWithMarker(context.root, context.paths, CARGO_MANIFEST),
        env: { ...context.env, CLIPPY_CONF_DIR: path.dirname(confFile) },
    });
    const report = clippySpec(advisory, failedWhenEmpty(SUCCESS_STATUSES));
    const fix = clippySpec(advisory, failedOnStatus(SUCCESS_STATUSES));
    return fixCycle(
        passTool(advisory, call(false), report),
        (findings) => context.fix && findings.length > 0,
        (reported) => {
            const fixed = passTool(advisory, call(true), fix);
            return fixed.terminal ? fixed.result : residualOf(reported, passTool(advisory, call(false), report));
        },
    );
};

defineTool({ ecosystems: [LANGUAGE], run: runClippy, tool: TOOL });
