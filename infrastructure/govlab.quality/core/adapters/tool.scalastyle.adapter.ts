import type { RunnerContext, ScanSpec } from "#types/tool.types";
import { commandHint, scalastyleIncomplete } from "#configuration/strings/tool.strings";
import { freshToolFile, readToolReport } from "#core/persistence/tool.persistence";
import type { RunResult } from "#types/finding.types";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseScalastyleXml } from "#core/parsers/tool.scalastyle.parser";
import { quietGatingAdvisory } from "#core/factories/tool.factory";
import { scanTool } from "#core/adapters/tool.adapter";
import { toolFailure } from "#core/factories/finding.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "scalastyle";
const DEFAULTS = { command: "java -jar scalastyle-batch.jar", config: "" };
const REPORT_FILE = "scalastyle.xml";
const PROCESSED_MARKER = "Processed ";

const runScalastyle = async function runScalastyle(context: RunnerContext): Promise<RunResult> {
    const { command, config } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, TOOL);
    const reportFile = freshToolFile(context.root, REPORT_FILE);
    const advisory = quietGatingAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec: ScanSpec = {
        failed: (result) => !result.stdout.includes(PROCESSED_MARKER),
        failure: (exit) => toolFailure(advisory, scalastyleIncomplete(exitDetail(exit))),
        parse: () => parseScalastyleXml(readToolReport(reportFile), context.ecosystem),
    };
    const args = [...prefix, "--config", config, "--xmlOutput", reportFile, ...context.paths];
    return scanTool(advisory, { args, bin, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["scala"], run: runScalastyle, tool: TOOL });
