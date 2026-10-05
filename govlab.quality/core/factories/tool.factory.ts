import type { AdvisoryContext, RunnerContext } from "#types/tool.types";
import { notInstalledOutput } from "#configuration/strings/tool.strings";

export const toolAdvisory = function toolAdvisory(
    context: RunnerContext,
    tool: string,
    installHint: string,
): AdvisoryContext {
    return { ecosystem: context.ecosystem, installHint, root: context.root, tool };
};

export const gatingAdvisory = function gatingAdvisory(
    context: RunnerContext,
    tool: string,
    installHint: string,
): AdvisoryContext {
    return { ...toolAdvisory(context, tool, installHint), failureSeverity: "error", gating: true };
};

export const quietGatingAdvisory = function quietGatingAdvisory(
    context: RunnerContext,
    tool: string,
    installHint: string,
): AdvisoryContext {
    return { ...gatingAdvisory(context, tool, installHint), notInstalledOutput: notInstalledOutput(tool) };
};
