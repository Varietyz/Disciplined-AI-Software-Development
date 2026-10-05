import { commandHint, toolErrorBecause } from "#configuration/strings/tool.strings";
import { messageScan, scanTool } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseCljKondoOutput } from "#core/parsers/tool.clj-kondo.parser";
import { quietGatingAdvisory } from "#core/factories/tool.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "clj-kondo";
const DEFAULTS = { command: TOOL, config: "" };
const FINDINGS_WARNING_EXIT = 2;
const FINDINGS_ERROR_EXIT = 3;
const OK_STATUSES: ReadonlySet<number> = new Set([0, FINDINGS_WARNING_EXIT, FINDINGS_ERROR_EXIT]);
const JSON_FORMAT_CONFIG = "{:output {:format :json}}";

const runCljKondo = async function runCljKondo(context: RunnerContext): Promise<RunResult> {
    const { command, config } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, TOOL);
    const advisory = quietGatingAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec = messageScan(
        advisory,
        OK_STATUSES,
        (result) => parseCljKondoOutput(result.stdout, context.ecosystem),
        (exit) => toolErrorBecause(TOOL, exit.status, "a malformed EDN config", exitDetail(exit)),
    );
    const consumerConfig = config.length > 0 ? ["--config", config] : [];
    const args = [...prefix, "--lint", ...context.paths, ...consumerConfig, "--config", JSON_FORMAT_CONFIG];
    return scanTool(advisory, { args, bin, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["clojure"], run: runCljKondo, tool: TOOL });
