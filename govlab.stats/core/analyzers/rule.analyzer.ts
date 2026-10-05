import type { ActiveRuleStats, OxlintSummary, RuleCount, ToolCounts, ToolMetrics } from "#types/rule.types";
import { LOCAL_PREFIX, SAMPLE_SEGMENTS } from "#configuration/constants/rule.constants";
import { arrayField, field, numberField, stringsIn } from "#core/selectors/field.selector";
import {
    govlabEslintConfig,
    govlabHtmlhintConfig,
    govlabJscpdConfig,
    govlabKnipConfig,
    govlabOxlintConfig,
    govlabPrettierConfig,
    govlabStylelintConfig,
    loadGovlabConfig,
} from "@govlab/quality/config";
import {
    jscpdConfiguration,
    knipConfiguration,
    oxlintConfiguration,
    prettierConfiguration,
} from "#configuration/strings/rule.strings";
import { ESLint } from "eslint";
import { isOff } from "#core/predicates/rule.predicate";
import { isRecord } from "#core/predicates/record.predicate";
import path from "node:path";
import { readRegistry } from "#core/loaders/registry.loader";
import { workspaceMembers } from "#core/resolvers/package.resolver";

const countOf = function countOf(values: readonly unknown[]): RuleCount {
    const disabled = values.filter(isOff).length;
    return { active: values.length - disabled, disabled };
};

const rulesOf = function rulesOf(config: unknown): Record<string, unknown> {
    const rules = field(config, "rules");
    return isRecord(rules) ? rules : {};
};

const resolveEslintRules = async function resolveEslintRules(root: string): Promise<Record<string, unknown>> {
    const sample = path.join(workspaceMembers(root).at(0) ?? root, ...SAMPLE_SEGMENTS);
    const eslint = new ESLint({ cwd: root, overrideConfig: await govlabEslintConfig(root), overrideConfigFile: true });
    return rulesOf(await eslint.calculateConfigForFile(sample));
};

const countLocal = function countLocal(resolved: Record<string, unknown>): RuleCount {
    return countOf(
        Object.entries(resolved)
            .filter(([id]) => id.startsWith(LOCAL_PREFIX))
            .map(([, value]) => value),
    );
};

const countOxlint = async function countOxlint(root: string): Promise<OxlintSummary> {
    const config = await govlabOxlintConfig(root);
    const categories = field(config, "categories");
    const enabled = isRecord(categories)
        ? Object.entries(categories)
              .filter(([, value]) => !isOff(value))
              .map(([name]) => name)
        : [];
    const count = countOf(Object.values(rulesOf(config)));
    return {
        categories: enabled.toSorted((a, b) => a.localeCompare(b)),
        disabled: count.disabled,
        tuned: count.active,
    };
};

const ruleBased = function ruleBased(count: RuleCount): ToolMetrics {
    return { active: count.active, configuration: "", disabled: count.disabled };
};

const settingsOnly = function settingsOnly(configuration: string): ToolMetrics {
    return { active: null, configuration, disabled: null };
};

const buildToolMetrics = async function buildToolMetrics(
    root: string,
    counts: ToolCounts,
): Promise<Map<string, ToolMetrics>> {
    const [htmlhint, jscpd, knip, prettier] = await Promise.all([
        govlabHtmlhintConfig(root),
        govlabJscpdConfig(root),
        govlabKnipConfig(root),
        govlabPrettierConfig(root),
    ]);
    const prettierOptions = isRecord(prettier) ? Object.keys(prettier).filter((key) => key !== "overrides") : [];
    const workspaces = field(knip, "workspaces");
    const htmlhintRules = Object.values(rulesOf(htmlhint));
    const jscpdText = jscpdConfiguration(
        numberField(jscpd, "threshold", 0),
        numberField(jscpd, "minTokens", 0),
        numberField(jscpd, "minLines", 0),
    );
    const knipText = knipConfiguration(
        isRecord(workspaces) ? Object.keys(workspaces).length : 0,
        arrayField(knip, "ignoreDependencies").length,
    );
    const prettierText = prettierConfiguration(
        prettierOptions.length,
        arrayField(prettier, "overrides").length,
        numberField(prettier, "printWidth", 0),
    );
    const oxlint: ToolMetrics = {
        active: null,
        configuration: oxlintConfiguration(counts.oxlint.categories.length, counts.oxlint.tuned),
        disabled: counts.oxlint.disabled,
    };
    return new Map<string, ToolMetrics>([
        ["eslint", ruleBased(counts.eslint)],
        ["stylelint", ruleBased(counts.stylelint)],
        ["htmlhint", ruleBased(countOf(htmlhintRules))],
        ["oxlint", oxlint],
        ["jscpd", settingsOnly(jscpdText)],
        ["knip", settingsOnly(knipText)],
        ["prettier", settingsOnly(prettierText)],
    ]);
};

const emptyActive = function emptyActive(reason: string): ActiveRuleStats {
    return {
        activeEcosystems: [],
        advisory: 0,
        available: false,
        byTool: new Map(),
        eslint: { active: 0, disabled: 0 },
        excluded: 0,
        fullGate: [],
        local: { active: 0, disabled: 0 },
        oxlint: { categories: [], disabled: 0, tuned: 0 },
        plugins: 0,
        reason,
        selectable: 0,
        stylelint: { active: 0, disabled: 0 },
    };
};

const activeRulesOf = async function activeRulesOf(root: string): Promise<ActiveRuleStats> {
    const [resolved, stylelintConfig, oxlint, config] = await Promise.all([
        resolveEslintRules(root),
        govlabStylelintConfig(root),
        countOxlint(root),
        loadGovlabConfig(root),
    ]);
    const configured = new Set(isRecord(config) ? Object.keys(config) : []);
    const registry = readRegistry(root);
    const eslint = countOf(Object.values(resolved));
    const stylelint = countOf(Object.values(rulesOf(stylelintConfig)));
    return {
        activeEcosystems: stringsIn(arrayField(field(config, "qualityMaster"), "ecosystems")),
        advisory: registry.advisory,
        available: true,
        byTool: await buildToolMetrics(root, { eslint, oxlint, stylelint }),
        eslint,
        excluded: registry.excluded,
        fullGate: registry.fullGate.filter((entry) => configured.has(entry.tool)),
        local: countLocal(resolved),
        oxlint,
        plugins: registry.plugins,
        reason: "",
        selectable: registry.selectable,
        stylelint,
    };
};

export const collectActiveRules = async function collectActiveRules(root: string): Promise<ActiveRuleStats> {
    try {
        return await activeRulesOf(root);
    } catch (error) {
        return emptyActive(error instanceof Error ? error.message : String(error));
    }
};
