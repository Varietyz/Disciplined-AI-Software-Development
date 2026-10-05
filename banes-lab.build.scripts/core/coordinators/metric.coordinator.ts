import { countedGroups, countedRules, gateSteps } from "#core/counters/metric.counter";
import type { SiteMetrics } from "#types/metric.types";
import { absolutePath } from "@ssot/paths";
import { loadMetricSnapshot } from "#core/loaders/metric.loader";
import { renderMetrics } from "#core/formatters/metric.formatter";
import { writeCanonicalText } from "@govlab/canonical-write";

export const buildMetrics = async function buildMetrics(): Promise<SiteMetrics> {
    const snapshot = await loadMetricSnapshot();
    const metrics: SiteMetrics = {
        principles: countedGroups(snapshot.principles, (group) => group.principles),
        rules: countedRules(),
        steps: gateSteps(),
        terms: countedGroups(snapshot.terms, (group) => group.terms),
    };
    await writeCanonicalText(absolutePath("app.metric"), renderMetrics(metrics));
    return metrics;
};
