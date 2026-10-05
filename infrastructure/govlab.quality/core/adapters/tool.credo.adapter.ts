import type { RunnerContext, ScanSpec } from "#types/tool.types";
import { commandHint, credoIncomplete } from "#configuration/strings/tool.strings";
import type { RunResult } from "#types/finding.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseCredoOutput } from "#core/parsers/tool.credo.parser";
import path from "node:path";
import { scanTool } from "#core/adapters/tool.adapter";
import { toolAdvisory } from "#core/factories/tool.factory";
import { toolFailure } from "#core/factories/finding.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "credo";
const DEFAULTS = { command: "mix" };
const JSON_OPEN = "{";

const runCredo = async function runCredo(context: RunnerContext): Promise<RunResult> {
    const { command } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, DEFAULTS.command);
    const advisory = toolAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec: ScanSpec = {
        failed: (result, findings) =>
            findings.length === 0 && !result.stdout.includes(JSON_OPEN) && (result.status ?? 0) !== 0,
        failure: (exit) => toolFailure(advisory, credoIncomplete(exit.status, exitDetail(exit))),
        parse: (result) => parseCredoOutput(result.stdout, context.ecosystem),
    };
    const cwd = path.join(context.root, context.paths[0] ?? ".");
    return scanTool(advisory, { args: [...prefix, TOOL, "--format", "json"], bin, cwd }, spec);
};

defineTool({ ecosystems: ["elixir"], run: runCredo, tool: TOOL });
