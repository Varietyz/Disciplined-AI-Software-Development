import type { Finding, RunResult } from "#types/finding.types";
import type { RunnerContext, ScanSpec, ToolSpawn } from "#types/tool.types";
import { commandHint, pmdRecoverable, toolErrorMessage } from "#configuration/strings/tool.strings";
import { toolFailure, toolFinding } from "#core/factories/finding.factory";
import { POSITION } from "#configuration/constants/tool.constants";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { exitDetail } from "#core/selectors/failure.selector";
import { parseSarifReport } from "#core/parsers/report.parser";
import { quietGatingAdvisory } from "#core/factories/tool.factory";
import { scanTool } from "#core/adapters/tool.adapter";
import { statusIn } from "#core/predicates/failure.predicate";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "pmd";
const DEFAULTS = {
    command: "java -cp pmd/lib/* net.sourceforge.pmd.cli.PmdCli",
    ruleset: "rulesets/java/quickstart.xml",
};
const VIOLATIONS_EXIT = 4;
const OK_STATUSES: ReadonlySet<number> = new Set([0, VIOLATIONS_EXIT]);

const recoverableFinding = function recoverableFinding(context: RunnerContext, status: number): Finding {
    return toolFinding({
        advisory: true,
        column: POSITION,
        ecosystem: context.ecosystem,
        file: context.root,
        line: POSITION,
        message: pmdRecoverable(status),
        ruleId: `${TOOL}/recoverable-error`,
        tool: TOOL,
    });
};

const runPmd = async function runPmd(context: RunnerContext): Promise<RunResult> {
    const { command, ruleset } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, TOOL);
    const advisory = quietGatingAdvisory(context, TOOL, commandHint(TOOL, bin));
    const reported = (result: ToolSpawn): Finding[] => parseSarifReport(result.stdout, context.ecosystem, TOOL);
    const spec: ScanSpec = {
        failed: (result) => !statusIn(OK_STATUSES, result.status) && reported(result).length === 0,
        failure: (exit) => toolFailure(advisory, toolErrorMessage(TOOL, exit.status, exitDetail(exit))),
        parse: (result) => {
            const status = result.status ?? 0;
            return [
                ...reported(result),
                ...(statusIn(OK_STATUSES, status) ? [] : [recoverableFinding(context, status)]),
            ];
        },
    };
    const args = [
        ...prefix,
        "check",
        "-f",
        "sarif",
        "-R",
        ruleset,
        ...context.paths.flatMap((target) => ["-d", target]),
    ];
    return scanTool(advisory, { args, bin, cwd: context.root }, spec);
};

defineTool({ ecosystems: ["java"], run: runPmd, tool: TOOL });
