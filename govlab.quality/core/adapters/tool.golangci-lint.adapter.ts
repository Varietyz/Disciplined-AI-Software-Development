import type { AdvisoryContext, RunnerContext, ScanSpec, ToolCall } from "#types/tool.types";
import { FINDING_STATUSES, GO_MODULE } from "#configuration/constants/tool.constants";
import { NO_STDERR_DETAIL, installHint, toolErrorBecause } from "#configuration/strings/tool.strings";
import { fixCycle, passTool, residualOf } from "#core/adapters/tool.adapter";
import { readToolReport, writeToolFile } from "#core/persistence/tool.persistence";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { failedOnStatus } from "#core/classifiers/invocation.classifier";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { nativeToolConfig } from "#core/resolvers/tool.resolver";
import { parseGolangciOutput } from "#core/parsers/tool.golangci-lint.parser";
import path from "node:path";
import { projectDirWithMarker } from "#core/resolvers/scope.resolver";
import { tailLines } from "#core/selectors/failure.selector";
import { toolFailure } from "#core/factories/finding.factory";

const TOOL = "golangci-lint";
const LANGUAGE = "go";
const CONFIG_FILE = ".golangci.yml";
const REPORT_FILE = "golangci-report.json";

interface Invocation {
    configFile: string;
    moduleDir: string;
    reportFile: string;
}

const golangciSpec = function golangciSpec(advisory: AdvisoryContext, reportFile: string): ScanSpec {
    return {
        failed: failedOnStatus(FINDING_STATUSES),
        failure: (exit) =>
            toolFailure(
                advisory,
                toolErrorBecause(
                    TOOL,
                    exit.status,
                    "a malformed config or module error",
                    tailLines(exit.stderr, NO_STDERR_DETAIL),
                ),
            ),
        parse: () => parseGolangciOutput(readToolReport(reportFile), advisory.ecosystem),
    };
};

const golangciCall = function golangciCall(invocation: Invocation, withFix: boolean): ToolCall {
    const args = [
        "run",
        "--config",
        invocation.configFile,
        "--output.json.path",
        invocation.reportFile,
        ...(withFix ? ["--fix"] : []),
        "./...",
    ];
    return { args, bin: TOOL, cwd: invocation.moduleDir };
};

const runGolangci = async function runGolangci(context: RunnerContext): Promise<RunResult> {
    const configFile = writeToolFile(
        context.root,
        CONFIG_FILE,
        await nativeToolConfig(context.root, LANGUAGE, CONFIG_FILE),
    );
    const invocation: Invocation = {
        configFile,
        moduleDir: projectDirWithMarker(context.root, context.paths, GO_MODULE),
        reportFile: path.join(path.dirname(configFile), REPORT_FILE),
    };
    const advisory = gatingAdvisory(context, TOOL, installHint(TOOL));
    const spec = golangciSpec(advisory, invocation.reportFile);
    return fixCycle(
        passTool(advisory, golangciCall(invocation, false), spec),
        (findings) => context.fix && findings.length > 0,
        (reported) => residualOf(reported, passTool(advisory, golangciCall(invocation, true), spec)),
    );
};

defineTool({ ecosystems: [LANGUAGE], run: runGolangci, tool: TOOL });
