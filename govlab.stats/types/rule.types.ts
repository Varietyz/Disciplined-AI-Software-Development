export interface RuleCount {
    active: number;
    disabled: number;
}

export interface OxlintSummary {
    categories: string[];
    disabled: number;
    tuned: number;
}

export interface ToolEntry {
    ecosystem: string;
    tool: string;
}

export interface ToolMetrics {
    active: number | null;
    configuration: string;
    disabled: number | null;
}

export interface ActiveRuleStats {
    activeEcosystems: string[];
    advisory: number;
    available: boolean;
    byTool: Map<string, ToolMetrics>;
    eslint: RuleCount;
    local: RuleCount;
    excluded: number;
    fullGate: ToolEntry[];
    oxlint: OxlintSummary;
    plugins: number;
    reason: string;
    selectable: number;
    stylelint: RuleCount;
}

export interface RegistryCounts {
    advisory: number;
    excluded: number;
    fullGate: ToolEntry[];
    plugins: number;
    selectable: number;
}

export interface ToolCounts {
    readonly eslint: RuleCount;
    readonly oxlint: OxlintSummary;
    readonly stylelint: RuleCount;
}
