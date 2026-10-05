import type { RunnerContext, SelectableToolSpec } from "#types/tool.types";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { nativeToolConfig } from "#core/resolvers/tool.resolver";
import { parsePylintOutput } from "#core/parsers/tool.pylint.parser";
import { runSelectable } from "#core/adapters/tool.adapter";

const TOOL = "pylint";
const LANGUAGE = "python";
const CONFIG_FILE = ".pylintrc";
const BINARY = 2;
const PYLINT_FATAL = 1;
const PYLINT_USAGE = 32;

const hasBit = function hasBit(value: number, bit: number): boolean {
    return Math.floor(value / bit) % BINARY !== 0;
};

export const pylintStatusOk = function pylintStatusOk(status: number | null): boolean {
    return status !== null && !hasBit(status, PYLINT_FATAL) && !hasBit(status, PYLINT_USAGE);
};

const PYLINT_SPEC: SelectableToolSpec = {
    argsFor: (configFile, context) => [
        "--output-format=json",
        "--recursive=y",
        ...(configFile === null ? [] : ["--rcfile", configFile]),
        ...context.paths,
    ],
    configFilename: CONFIG_FILE,
    cwdFor: (context) => context.root,
    loadConfig: async (root) => nativeToolConfig(root, LANGUAGE, CONFIG_FILE),
    parse: parsePylintOutput,
    statusOk: pylintStatusOk,
    tool: TOOL,
};

const runPylint = async function runPylint(context: RunnerContext): Promise<RunResult> {
    return runSelectable(PYLINT_SPEC, context);
};

defineTool({ ecosystems: [LANGUAGE], run: runPylint, tool: TOOL });
