import type { ESLint, Linter, Rule } from "eslint";
import type { FilenameCarrier, ScopeCarrier } from "#types/eslint.types";
import { CORE_PLUGIN_SCOPE } from "#configuration/constants/eslint.constants";
import { containsAny } from "#core/predicates/filename.predicate";
import { govlabSettings } from "#core/selectors/eslint.selector";
import { isRecord } from "#core/selectors/record.selector";

export const underAny = function underAny(context: FilenameCarrier, fragments?: readonly string[]): boolean {
    return containsAny(context.filename, fragments);
};

export const inHostScope = function inHostScope(context: ScopeCarrier): boolean {
    const { layout } = govlabSettings(context);
    return underAny(context, layout?.frontendMarkers) && !underAny(context, layout?.backendMarkers);
};

export const isPlugin = (value: unknown): value is ESLint.Plugin => isRecord(value);

export const isParser = (value: unknown): value is Linter.Parser => isRecord(value);

export const isRuleEntry = (value: unknown): value is Linter.RuleEntry =>
    typeof value === "string" || typeof value === "number" || Array.isArray(value);

export const isCorePlugin = (npm: string): boolean => npm.startsWith(CORE_PLUGIN_SCOPE);

export const isRuleModule = function isRuleModule(value: unknown): value is Rule.RuleModule {
    return isRecord(value) && typeof value["create"] === "function";
};
