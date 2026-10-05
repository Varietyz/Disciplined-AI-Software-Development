export interface SiteMetrics {
    readonly principles: number;
    readonly rules: number;
    readonly steps: number;
    readonly terms: number;
}

export interface CategoryGroup {
    readonly principles?: readonly unknown[];
    readonly terms?: readonly unknown[];
}

export interface MetricSnapshot {
    readonly principles: readonly CategoryGroup[];
    readonly terms: readonly CategoryGroup[];
}
