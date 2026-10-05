import { passTool, scanTargets, standardScan } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { SUCCESS_STATUSES } from "#configuration/constants/tool.constants";
import { commandHint } from "#configuration/strings/tool.strings";
import { commandOf } from "#core/lexers/invocation.lexer";
import { defineTool } from "#core/registries/tool.registry";
import { parseCheckovOutput } from "#core/parsers/tool.checkov.parser";
import { scopeTargets } from "#core/resolvers/scope.resolver";
import { toolAdvisory } from "#core/factories/tool.factory";
import { toolSetting } from "#core/resolvers/tool.resolver";

const TOOL = "checkov";
const DEFAULTS = { command: "python -m checkov.main" };

const runCheckov = async function runCheckov(context: RunnerContext): Promise<RunResult> {
    const { command } = await toolSetting(context.root, TOOL, DEFAULTS);
    const { bin, prefix } = commandOf(command, TOOL);
    const advisory = toolAdvisory(context, TOOL, commandHint(TOOL, bin));
    const spec = standardScan(advisory, SUCCESS_STATUSES, (result) =>
        parseCheckovOutput(result.stdout, context.ecosystem),
    );
    return scanTargets(scopeTargets(context.root, context.paths), (target) => {
        const args = [...prefix, "-d", target, "-o", "json", "--compact", "--quiet", "--soft-fail"];
        return passTool(advisory, { args, bin, cwd: context.root }, spec);
    });
};

defineTool({ ecosystems: ["iac"], run: runCheckov, tool: TOOL });
