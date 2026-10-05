import type { SiteMetrics } from "#types/metric.types";

export const renderMetrics = function renderMetrics(metrics: SiteMetrics): string {
    return [
        'import type { SiteMetrics } from "#types/metric.types";',
        "",
        `export const SITE_METRICS: SiteMetrics = JSON.parse(${JSON.stringify(JSON.stringify(metrics))});`,
        "",
    ].join("\n");
};
