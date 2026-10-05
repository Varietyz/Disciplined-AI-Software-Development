import { arrayField, isRecord, stringArrayField } from "#core/selectors/record.selector";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { axisPluginsFor } from "#core/factories/axis.factory";
import { defineTool } from "#core/registries/tool.registry";
import { emitStylelintConfig } from "#core/emitters/stylelint.emitter";
import govlabStylelintPlugins from "#core/plugins/stylelint.plugin";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { loadUserPlugins } from "#core/loaders/plugin.loader";
import process from "node:process";
import { registerCanon } from "#core/registries/stylelint.registry";
import { sectionOf } from "#core/selectors/config.selector";
import stylelint from "stylelint";
import { toolFinding } from "#core/factories/finding.factory";
import { typeSystemRuleOptions } from "#core/converters/stylelint.converter";
import { validConcepts } from "#core/selectors/concept.selector";
import { validateConcerns } from "#core/validators/concern.validator";
import { withMasterExclude } from "#core/selectors/exclusions.selector";

const SECTION = "stylelint";

export const govlabStylelintConfig = async (consumerRoot: string = process.cwd()): Promise<Record<string, unknown>> => {
    const config = await loadGovlabConfig(consumerRoot);
    const section = sectionOf(config, SECTION);
    const base = isRecord(section["base"]) ? section["base"] : {};
    const ownRules = isRecord(section["rules"]) ? section["rules"] : {};
    const typeSystem = config.eslint?.layout?.typeSystem;
    const concerns = validateConcerns(config.qualityMaster?.concerns ?? {}, validConcepts());
    const emitted = emitStylelintConfig({ concerns, exclude: stringArrayField(section, "exclude") });
    const axes = axisPluginsFor(typeSystem);
    for (const meta of axes.meta) {
        registerCanon(meta);
    }
    const userPlugins = await loadUserPlugins(consumerRoot, { allowGlobal: config.extensions?.global ?? false });
    const rules = { ...emitted, ...ownRules };
    const basePlugins = arrayField(base, "plugins");
    return {
        ...base,
        ignoreFiles: withMasterExclude(config, stringArrayField(base, "ignoreFiles")),
        plugins: [...basePlugins, ...govlabStylelintPlugins, ...axes.plugins, ...userPlugins.stylelint],
        rules: { ...rules, ...typeSystemRuleOptions(typeSystem, rules), ...axes.rules },
    };
};

const runStylelint = async function runStylelint(context: RunnerContext): Promise<RunResult> {
    const result = await stylelint.lint({
        allowEmptyInput: true,
        config: await govlabStylelintConfig(context.root),
        cwd: context.root,
        files: context.paths,
        fix: context.fix,
        formatter: "string",
    });
    const findings = result.results.flatMap((fileResult) =>
        fileResult.warnings.map((warning) =>
            toolFinding({
                column: warning.column,
                ecosystem: context.ecosystem,
                file: fileResult.source ?? "",
                line: warning.line,
                message: warning.text,
                ruleId: warning.rule,
                tool: SECTION,
            }),
        ),
    );
    return { findings, fixedCount: 0, output: result.report };
};

defineTool({ ecosystems: ["css"], run: runStylelint, tool: SECTION });
