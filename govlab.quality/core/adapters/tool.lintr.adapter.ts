import { LINTR_DELIMITER, parseLintrOutput } from "#core/parsers/tool.lintr.parser";
import type { RunnerContext, ScanSpec } from "#types/tool.types";
import { commandHint, lintrFailed } from "#configuration/strings/tool.strings";
import type { RunResult } from "#types/finding.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { scanTool } from "#core/adapters/tool.adapter";
import { toolAdvisory } from "#core/factories/tool.factory";
import { toolFailure } from "#core/factories/finding.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "lintr";
const DEFAULTS = { command: "Rscript" };
const LINT_SCRIPT = String.raw`for (f in commandArgs(TRUE)) { lints <- if (dir.exists(f)) lintr::lint_dir(f) else lintr::lint(f); for (l in as.list(lints)) { cat(paste(l$filename, l$line_number, l$column_number, l$type, l$linter, gsub("[\r\n]", " ", l$message), sep="${LINTR_DELIMITER}"), "\n", sep="") } }`;

const runLintr = async function runLintr(context: RunnerContext): Promise<RunResult> {
    const { command } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, DEFAULTS.command);
    const advisory = toolAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec: ScanSpec = {
        failed: (result, findings) => findings.length === 0 && (result.status ?? 0) !== 0,
        failure: (exit) => toolFailure(advisory, lintrFailed(exit.status, exitDetail(exit))),
        parse: (result) => parseLintrOutput(result.stdout, context.ecosystem),
    };
    return scanTool(advisory, { args: [...prefix, "-e", LINT_SCRIPT, ...context.paths], bin, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["r"], run: runLintr, tool: TOOL });
