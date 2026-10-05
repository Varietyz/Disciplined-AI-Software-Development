import type { EmitContext, EmitPolicy, EslintRuleEntry, RuleOptions, ValueContext } from "#types/eslint.types";
import {
    GOVLAB_NAMESPACES,
    INCOMPATIBLE_ESLINT_RULES,
    JS_ESLINT_TOOLS,
    NON_ESLINT_TOOLS,
    REQUIRES_MANDATORY_OPTIONS,
    RULE_OPTION_DEFAULTS,
} from "#configuration/constants/eslint.constants";
import type { QualityData, QualityRuleRecord } from "#types/catalog.types";
import type { ResolvedConcern } from "#types/concern.types";
import { excludedByConcept } from "#core/predicates/concept.predicate";
import { loadQualityData } from "#core/loaders/quality.loader";
import { resolveConcernMap } from "#core/converters/concern.converter";

const pluginNamespaceOf = function pluginNamespaceOf(ruleId: string): string | null {
    const slash = ruleId.indexOf("/");
    return slash === -1 ? null : ruleId.slice(0, slash);
};

const eslintRuleKey = function eslintRuleKey(rule: QualityRuleRecord): string {
    const namespace = GOVLAB_NAMESPACES.get(rule.tool);
    return typeof namespace === "string" ? `${namespace}/${rule.ruleId}` : rule.ruleId;
};

const ruleNamespace = function ruleNamespace(rule: QualityRuleRecord): string | null {
    return GOVLAB_NAMESPACES.get(rule.tool) ?? pluginNamespaceOf(rule.ruleId);
};

const optionKnob = function optionKnob(rule: QualityRuleRecord): string | null {
    const thresholds = (rule.knobs ?? []).filter((knob) => knob.threshold);
    return (thresholds.find((knob) => knob.knob === "max") ?? thresholds[0])?.knob ?? null;
};

const ruleDefault = function ruleDefault(rule: QualityRuleRecord): number | null {
    const knobs = rule.knobs ?? [];
    const threshold = knobs.find((knob) => knob.threshold && typeof knob.default === "number");
    const value = knobs.find((knob) => knob.knob === "value" && typeof knob.default === "number");
    const chosen = (threshold ?? value)?.default;
    return typeof chosen === "number" ? chosen : null;
};

const conceptThresholds = function conceptThresholds(data: QualityData): Map<string, number> {
    const mins = new Map<string, number>();
    for (const rule of data.rules) {
        const def = ruleDefault(rule);
        for (const concept of def === null ? [] : (rule.canonical ?? [])) {
            mins.set(concept, Math.min(mins.get(concept) ?? def ?? 0, def ?? 0));
        }
    }
    return mins;
};

const eslintRuleTarget = function eslintRuleTarget(rule: QualityRuleRecord, activePlugins: Set<string>): string | null {
    const key = eslintRuleKey(rule);
    if (NON_ESLINT_TOOLS.has(rule.tool) || INCOMPATIBLE_ESLINT_RULES.has(key)) {
        return null;
    }
    if (JS_ESLINT_TOOLS.has(rule.tool)) {
        return key;
    }
    const namespace = ruleNamespace(rule);
    return namespace !== null && activePlugins.has(namespace) ? key : null;
};

const buildEslintRuleIndex = function buildEslintRuleIndex(
    data: QualityData,
    activePlugins: Set<string>,
): Map<string, QualityRuleRecord> {
    const ruleByKey = new Map<string, QualityRuleRecord>();
    for (const rule of data.rules) {
        const key = eslintRuleTarget(rule, activePlugins);
        if (key !== null) {
            ruleByKey.set(key, rule);
        }
    }
    return ruleByKey;
};

const pickMin = function pickMin(values: (number | undefined)[]): number | undefined {
    const nums = values.filter((value): value is number => typeof value === "number");
    return nums.length > 0 ? Math.min(...nums) : undefined;
};

const resolvedValue = function resolvedValue(
    rule: QualityRuleRecord,
    key: string,
    ctx: ValueContext,
): number | undefined {
    const canon = rule.canonical ?? [];
    const override = ctx.overrides[key];
    if (typeof override === "number") {
        return override;
    }
    const explicit = pickMin(canon.map((concept) => ctx.conceptOverride.get(concept)));
    return explicit ?? ruleDefault(rule) ?? pickMin(canon.map((concept) => ctx.conceptMin.get(concept)));
};

const entryOptions = function entryOptions(rule: QualityRuleRecord, key: string, ctx: EmitContext): RuleOptions {
    const opts: RuleOptions = { ...RULE_OPTION_DEFAULTS.get(key), ...ctx.extraOptions[key] };
    const option = optionKnob(rule);
    const value = option === null ? undefined : resolvedValue(rule, key, ctx.valueCtx);
    if (option !== null && typeof value === "number") {
        opts[option] = value;
    }
    return opts;
};

const isExcluded = function isExcluded(rule: QualityRuleRecord, key: string, ctx: EmitContext): boolean {
    return (
        ctx.excludeRules.has(key) ||
        ctx.excludeCategories.has(rule.category) ||
        excludedByConcept(rule.canonical ?? [], ctx.concernMap)
    );
};

const emitRuleEntry = function emitRuleEntry(key: string, ctx: EmitContext): EslintRuleEntry | null {
    const rule = ctx.ruleByKey.get(key);
    if (!rule || rule.category === "deprecated" || REQUIRES_MANDATORY_OPTIONS.has(key) || isExcluded(rule, key, ctx)) {
        return null;
    }
    const opts = entryOptions(rule, key, ctx);
    return Object.keys(opts).length > 0 ? ["error", opts] : "error";
};

const buildConceptOverride = function buildConceptOverride(
    concernMap: Map<string, ResolvedConcern>,
): Map<string, number> {
    return new Map(
        [...concernMap].flatMap(([concept, resolved]): [string, number][] =>
            typeof resolved.value === "number" ? [[concept, resolved.value]] : [],
        ),
    );
};

export const emitEslintConfig = function emitEslintConfig(
    policy: EmitPolicy = {},
    data: QualityData = loadQualityData(),
): Record<string, EslintRuleEntry> {
    const concernMap = resolveConcernMap(policy.concerns ?? {});
    const ruleByKey = buildEslintRuleIndex(data, new Set(policy.activePlugins));
    const ctx: EmitContext = {
        concernMap,
        excludeCategories: new Set(policy.exclude?.category),
        excludeRules: new Set(policy.exclude?.rule),
        extraOptions: policy.options ?? {},
        ruleByKey,
        valueCtx: {
            conceptMin: conceptThresholds(data),
            conceptOverride: buildConceptOverride(concernMap),
            overrides: policy.overrides ?? {},
        },
    };
    const out: Record<string, EslintRuleEntry> = {};
    for (const key of policy.rules ?? [...ruleByKey.keys()]) {
        const entry = emitRuleEntry(key, ctx);
        if (entry !== null) {
            out[key] = entry;
        }
    }
    return out;
};

export const eslintRulesForConcepts = function eslintRulesForConcepts(
    concepts: string[],
    data: QualityData = loadQualityData(),
): string[] {
    const wanted = new Set(concepts);
    const keys = data.rules
        .filter(
            (rule) => JS_ESLINT_TOOLS.has(rule.tool) && (rule.canonical ?? []).some((concept) => wanted.has(concept)),
        )
        .map(eslintRuleKey);
    return [...new Set(keys)];
};
