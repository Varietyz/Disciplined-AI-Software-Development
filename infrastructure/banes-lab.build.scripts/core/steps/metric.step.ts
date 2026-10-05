import { buildMetrics } from "#core/coordinators/metric.coordinator";
import { defineStep } from "#core/factories/step.factory";
import { metricsLine } from "#configuration/strings/metric.strings";
import { relativePath } from "@ssot/paths";

defineStep({
    cache: null,
    name: "metrics",
    needs: ["ontology"],
    phase: "start",
    async run() {
        return { gives: {}, line: metricsLine(await buildMetrics(), relativePath("app.metric")) };
    },
});
