import {
    DEPRECATED_CATEGORY,
    GOVLAB_STYLELINT_TOOLS,
    STYLELINT_TOOL,
} from "#configuration/constants/stylelint.constants";
import type { QualityData, QualityRuleRecord } from "#types/catalog.types";
import type { StylelintEmitPolicy, StylelintPrimary, StylelintRuleEntry } from "#types/stylelint.types";
import type { ResolvedConcern } from "#types/concern.types";
import { excludedByConcept } from "#core/predicates/concept.predicate";
import { loadQualityData } from "#core/loaders/quality.loader";
import { resolveConcernMap } from "#core/converters/concern.converter";

const optionEntry = function optionEntry(optionValue: (number | string)[]): [StylelintPrimary] {
    const [only] = optionValue;
    if (optionValue.length === 0) {
        return [true];
    }
    return optionValue.length === 1 && only !== undefined ? [only] : [optionValue];
};

const resolvedStylelintValue = function resolvedStylelintValue(
    resolved: ResolvedConcern,
    hasLimitKnob: boolean,
): [StylelintPrimary] | null {
    if (resolved.exclude) {
        return null;
    }
    if (typeof resolved.value === "number") {
        return hasLimitKnob ? [resolved.value] : null;
    }
    return optionEntry(resolved.optionValue ?? []);
};

const stylelintConceptValue = function stylelintConceptValue(
    rule: QualityRuleRecord,
    concernMap: Map<string, ResolvedConcern>,
): StylelintRuleEntry | null {
    const hasLimitKnob = (rule.knobs ?? []).some((knob) => knob.threshold);
    const resolved = (rule.canonical ?? [])
        .map((concept) => concernMap.get(concept))
        .find((entry) => entry !== undefined);
    return resolved === undefined ? null : resolvedStylelintValue(resolved, hasLimitKnob);
};

const standardStylelintRules = function standardStylelintRules(
    data: QualityData,
    concernMap: Map<string, ResolvedConcern>,
): Record<string, StylelintRuleEntry> {
    const out: Record<string, StylelintRuleEntry> = {};
    for (const rule of data.rules.filter(
        (entry) => entry.tool === STYLELINT_TOOL && entry.category !== DEPRECATED_CATEGORY,
    )) {
        const emitted = stylelintConceptValue(rule, concernMap);
        if (emitted !== null) {
            out[rule.ruleId] = emitted;
        }
    }
    return out;
};

export const emitStylelintConfig = function emitStylelintConfig(
    policy: StylelintEmitPolicy = {},
    data: QualityData = loadQualityData(),
): Record<string, StylelintRuleEntry> {
    const exclude = new Set(policy.exclude);
    const options = policy.options ?? {};
    const concernMap = resolveConcernMap(policy.concerns ?? {});
    const catalogKeys = data.rules
        .filter((rule) => GOVLAB_STYLELINT_TOOLS.has(rule.tool) && rule.category !== DEPRECATED_CATEGORY)
        .filter((rule) => !excludedByConcept(rule.canonical ?? [], concernMap))
        .map((rule) => rule.ruleId);
    const keys = (policy.rules ?? catalogKeys).filter((key) => !exclude.has(key));
    const out = standardStylelintRules(data, concernMap);
    for (const key of keys) {
        const extra = options[key];
        out[key] = extra ? [true, extra] : true;
    }
    return out;
};
