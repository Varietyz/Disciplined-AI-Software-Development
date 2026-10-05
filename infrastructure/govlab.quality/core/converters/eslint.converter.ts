import type { ESLint, Linter } from "eslint";
import { isPlugin, isRuleEntry } from "#core/predicates/eslint.predicate";
import type { InstalledPlugin } from "#types/eslint.types";
import { TS_PREFIX } from "#configuration/constants/eslint.constants";

export const toRulesRecord = (source: Record<string, unknown>): Linter.RulesRecord => {
    const out: Linter.RulesRecord = {};
    for (const [key, value] of Object.entries(source)) {
        if (isRuleEntry(value)) {
            out[key] = value;
        }
    }
    return out;
};

export const pluginsFromRecord = (source: Record<string, unknown>): Record<string, ESLint.Plugin> => {
    const out: Record<string, ESLint.Plugin> = {};
    for (const [key, value] of Object.entries(source)) {
        if (isPlugin(value)) {
            out[key] = value;
        }
    }
    return out;
};

export const namespacesOf = (entries: InstalledPlugin[]): string[] =>
    entries.map((entry) => entry.record.pluginNamespace).filter((ns): ns is string => typeof ns === "string");

export const pluginMap = (entries: InstalledPlugin[]): Record<string, ESLint.Plugin> => {
    const out: Record<string, ESLint.Plugin> = {};
    for (const entry of entries) {
        const namespace = entry.record.pluginNamespace;
        if (typeof namespace === "string" && isPlugin(entry.plugin)) {
            out[namespace] = entry.plugin;
        }
    }
    return out;
};

export const jsRulesOf = (rules: Linter.RulesRecord): Linter.RulesRecord =>
    Object.fromEntries(Object.entries(rules).filter(([key]) => !key.startsWith(TS_PREFIX)));
