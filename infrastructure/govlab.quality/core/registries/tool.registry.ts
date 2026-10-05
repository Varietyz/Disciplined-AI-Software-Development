import type { ToolRunner } from "#types/tool.types";

const TOOLS = new Map<string, ToolRunner>();

export const defineTool = function defineTool(runner: ToolRunner): ToolRunner {
    TOOLS.set(runner.tool, runner);
    return runner;
};

export const registeredTools = function registeredTools(): ToolRunner[] {
    return [...TOOLS.values()].toSorted((a, b) => a.tool.localeCompare(b.tool));
};
