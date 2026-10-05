import { isRecord, stringArrayField, stringField } from "#core/selectors/record.selector";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { commandHint } from "#configuration/strings/tool.strings";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { parseYamllintOutput } from "#core/parsers/tool.yamllint.parser";
import process from "node:process";
import { sectionOf } from "#core/selectors/config.selector";
import { spawnTool } from "#core/adapters/invocation.adapter";
import { terminalOf } from "#core/classifiers/invocation.classifier";
import { toolAdvisory } from "#core/factories/tool.factory";
import { withMasterExclude } from "#core/selectors/exclusions.selector";

const SECTION = "yamllint";
const DEFAULT_COMMAND = "python -m yamllint";
const DEFAULT_EXTENDS = "default";

export const govlabYamllintConfig = async function govlabYamllintConfig(
    consumerRoot: string = process.cwd(),
): Promise<{ command: string; config: Record<string, unknown> }> {
    const config = await loadGovlabConfig(consumerRoot);
    const section = sectionOf(config, SECTION);
    const inline: Record<string, unknown> = { extends: stringField(section, "extends", DEFAULT_EXTENDS) };
    const { rules } = section;
    if (isRecord(rules) && Object.keys(rules).length > 0) {
        inline["rules"] = rules;
    }
    const ignore = withMasterExclude(config, stringArrayField(section, "ignore"));
    if (ignore.length > 0) {
        inline["ignore"] = ignore.join("\n");
    }
    return { command: stringField(section, "command", DEFAULT_COMMAND), config: inline };
};

const runYamllint = async function runYamllint(context: RunnerContext): Promise<RunResult> {
    const { command, config } = await govlabYamllintConfig(context.root);
    const { bin, prefix } = commandOf(command, SECTION);
    const advisory = toolAdvisory(context, SECTION, commandHint(SECTION, bin));
    const args = [...prefix, "-d", JSON.stringify(config), "-f", "parsable", ...context.paths];
    const result = spawnTool(bin, args, { cwd: context.root, encoding: "utf8", shell: false });
    const terminal = terminalOf(advisory, result);
    if (terminal !== null) {
        return terminal;
    }
    const output = `${result.stdout}${result.stderr}`;
    return { findings: parseYamllintOutput(output, context.ecosystem), fixedCount: 0, output };
};

defineTool({ ecosystems: ["yaml"], run: runYamllint, tool: SECTION });
