import type { GovlabStylelintMeta, StylelintRuleMeta } from "#types/stylelint.types";
import type { Plugin, PostcssResult, RuleMessages } from "stylelint";

export interface AxisPlugins {
    meta: GovlabStylelintMeta[];
    plugins: Plugin[];
    rules: Record<string, [true, { home: string; steps: string[] }]>;
}

export interface AxisSpec {
    attrToken: string;
    label: string;
    meta: StylelintRuleMeta;
    owns: string;
    ruleId: string;
    ruleName: string;
}

export interface AxisSecondaryOptions {
    home?: string;
    steps?: string[];
}

export type ForeignFn = (selector: string, home: string) => string;

export type RedefinedFn = (step: string) => string;

export interface AxisMessages {
    foreign: ForeignFn;
    messages: RuleMessages;
    redefined: RedefinedFn;
}

export interface AxisContext {
    attrToken: string;
    foreign: ForeignFn;
    home: string;
    isHome: boolean;
    redefined: RedefinedFn;
    result: PostcssResult;
    ruleName: string;
    validSteps: Set<string>;
}

export interface AxisRuleInputs {
    spec: AxisSpec;
    built: AxisMessages;
    primary: unknown;
    secondaryOptions: unknown;
}
