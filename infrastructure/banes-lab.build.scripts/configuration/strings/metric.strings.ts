import type { SiteMetrics } from "#types/metric.types";

export const metricsLine = function metricsLine(metrics: SiteMetrics, file: string): string {
    return `metrics: wrote ${String(metrics.rules)} rule(s), ${String(metrics.steps)} gate step(s), ${String(metrics.principles)} principle(s) and ${String(metrics.terms)} term(s) into ${file}\n`;
};

export const NO_METRIC_GROUPS =
    "metrics: the ontology snapshot carries no principle and term groups. Run the ontology step to write the snapshot again.";
