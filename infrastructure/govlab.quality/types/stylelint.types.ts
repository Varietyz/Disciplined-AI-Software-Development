import type { ConcernConfig } from "#types/concern.types";

export type StylelintPrimary = (number | string)[] | boolean | number | string;

export type StylelintRuleEntry = StylelintPrimary | [boolean, Record<string, unknown>] | [StylelintPrimary];

export interface StylelintEmitPolicy {
    rules?: string[] | undefined;
    exclude?: string[] | undefined;
    concerns?: ConcernConfig | undefined;
    options?: Record<string, Record<string, unknown>> | undefined;
}

export interface StylelintRuleMeta {
    canonical: string[];
    description: string;
    url?: string;
    fixable?: boolean;
}

export interface GovlabStylelintMeta {
    ruleId: string;
    ruleName: string;
    meta: StylelintRuleMeta;
}
