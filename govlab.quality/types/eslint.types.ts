import type { ConcernConfig, ResolvedConcern } from "#types/concern.types";
import type { ESLint, Linter, Rule } from "eslint";
import type { GovlabEslintSettings } from "#types/config.types";
import type { InstallRecord } from "#types/dependency.types";
import type { QualityRuleRecord } from "#types/catalog.types";

export type RuleOptionValue = number[] | boolean | number | string;

export type RuleOptions = Record<string, RuleOptionValue>;

export type EslintRuleEntry = "error" | ["error", RuleOptions];

interface EmitExclude {
    rule?: string[];
    category?: string[];
}

export interface EmitPolicy {
    rules?: string[];
    exclude?: EmitExclude;
    concerns?: ConcernConfig;
    activePlugins?: string[];
    overrides?: Record<string, number>;
    options?: Record<string, Record<string, number[] | boolean | number>>;
}

export interface ValueContext {
    overrides: Record<string, number>;
    conceptOverride: Map<string, number>;
    conceptMin: Map<string, number>;
}

export interface EmitContext {
    ruleByKey: Map<string, QualityRuleRecord>;
    concernMap: Map<string, ResolvedConcern>;
    valueCtx: ValueContext;
    extraOptions: Record<string, Record<string, number[] | boolean | number>>;
    excludeRules: Set<string>;
    excludeCategories: Set<string>;
}

export interface GovlabRuleDocs {
    description: string;
    canonical: string[];
    ruleId: string;
    url?: string | undefined;
}

export interface GovlabRuleSpec {
    ruleId: string;
    description: string;
    canonical: string[];
    messages: Record<string, string>;
    type?: "layout" | "problem" | "suggestion";
    fixable?: "code" | "whitespace";
    hasSuggestions?: boolean;
    schema?: Rule.RuleMetaData["schema"];
    url?: string;
}

export type GovlabSettings = Partial<GovlabEslintSettings>;

export interface SettingsCarrier {
    settings?: { govlab?: GovlabSettings } | undefined;
}

export interface FilenameCarrier {
    filename: string;
}

export interface ScopeCarrier extends FilenameCarrier, SettingsCarrier {}

export interface InstalledPlugin {
    plugin: unknown;
    record: InstallRecord;
}

export interface LoadedPlugin {
    plugin: unknown;
    record: { npm?: string | null | undefined };
}

export interface BaseContext {
    globals?: Record<string, string>;
    plugins: Record<string, ESLint.Plugin>;
    rules: Linter.RulesRecord;
    settings: Linter.Config["settings"];
    tsParser: unknown;
}

export interface TsTestScopeOptions {
    tsParser: unknown;
    language: Linter.Config["languageOptions"];
    disabled: Linter.RulesRecord;
    extraGlobs?: string[];
}

export interface CoreState {
    htmlPlugin: unknown;
    installed: InstalledPlugin[];
    plugins: Record<string, ESLint.Plugin>;
    rules: Linter.RulesRecord;
    settings: Linter.Config["settings"];
    tsParser: unknown;
}
