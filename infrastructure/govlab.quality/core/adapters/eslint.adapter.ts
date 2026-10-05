import { ALL_IGNORED_MARKER, JS_ECOSYSTEMS, STYLISH_FORMATTER } from "#configuration/constants/eslint.constants";
import { EMPTY_RESULT, toolFinding } from "#core/factories/finding.factory";
import type { Finding, RunResult } from "#types/finding.types";
import { ESLint } from "eslint";
import type { RunnerContext } from "#types/tool.types";
import type { SafeFixOutcome } from "#types/edit.types";
import { applyCuratedSuggestions } from "#core/converters/edit.converter";
import { applyFixesSafely } from "#core/persistence/edit.persistence";
import { defineTool } from "#core/registries/tool.registry";
import { dryRunFixes } from "#configuration/strings/tool.strings";
import { govlabEslintConfig } from "#core/factories/eslint.setup.factory";
import { readFileSync } from "node:fs";

const ESLINT_TOOL = "eslint";

const isAllIgnored = function isAllIgnored(error: unknown): boolean {
    return error instanceof Error && error.message.includes(ALL_IGNORED_MARKER);
};

const lintOne = async function lintOne(eslint: ESLint, target: string): Promise<ESLint.LintResult[]> {
    try {
        return await eslint.lintFiles([target]);
    } catch (error) {
        if (isAllIgnored(error)) {
            return [];
        }
        throw error;
    }
};

const applyCurated = function applyCurated(results: readonly ESLint.LintResult[]): void {
    for (const result of results) {
        const applied = applyCuratedSuggestions(result, result.output ?? readFileSync(result.filePath, "utf8"));
        if (applied !== null) {
            result.output = applied.output;
        }
    }
};

const fixSummary = function fixSummary(outcome: SafeFixOutcome, dryRun: boolean): string {
    if (!dryRun || outcome.pending.length === 0) {
        return "";
    }
    return dryRunFixes(outcome.pending.length, outcome.pending.map((file) => `  ${file}`).join("\n"));
};

const eslintFindings = function eslintFindings(results: readonly ESLint.LintResult[], ecosystem: string): Finding[] {
    return results.flatMap((result) =>
        result.messages.map((message) =>
            toolFinding({
                column: message.column,
                ecosystem,
                file: result.filePath,
                fixable: Boolean(message.fix),
                line: message.line,
                message: message.message,
                ruleId: message.ruleId ?? ESLINT_TOOL,
                tool: ESLINT_TOOL,
            }),
        ),
    );
};

const fixedRun = function fixedRun(results: readonly ESLint.LintResult[], context: RunnerContext): SafeFixOutcome {
    applyCurated(results);
    return applyFixesSafely(results, { backup: context.backup, dryRun: context.dryRun, root: context.root });
};

export const runEslint = async function runEslint(context: RunnerContext): Promise<RunResult> {
    const overrideConfig = await govlabEslintConfig(context.root);
    const eslint = new ESLint({
        cwd: context.root,
        fix: context.fix,
        overrideConfig,
        overrideConfigFile: true,
        warnIgnored: false,
    });
    const results = (await Promise.all(context.paths.map(async (target) => lintOne(eslint, target)))).flat();
    if (results.length === 0) {
        return EMPTY_RESULT;
    }
    const outcome = context.fix ? fixedRun(results, context) : null;
    const formatter = await eslint.loadFormatter(STYLISH_FORMATTER);
    const summary = outcome === null ? "" : fixSummary(outcome, context.dryRun === true);
    return {
        findings: eslintFindings(results, context.ecosystem),
        fixedCount: outcome?.written.length ?? 0,
        output: (await formatter.format(results)) + summary,
    };
};

defineTool({ ecosystems: [...JS_ECOSYSTEMS], run: runEslint, tool: ESLINT_TOOL });
