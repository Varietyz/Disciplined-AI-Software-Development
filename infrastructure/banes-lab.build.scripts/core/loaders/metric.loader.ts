import type { MetricSnapshot } from "#types/metric.types";
import { NO_METRIC_GROUPS } from "#configuration/strings/metric.strings";
import { isRecord } from "#core/selectors/base.selector";

const ONTOLOGY_MODULE = "@banes-lab/web/core/generated/ontology.generated.ts";
const ONTOLOGY_EXPORT = "ONTOLOGY";

const isGroupList = function isGroupList(value: unknown): boolean {
    return Array.isArray(value) && value.every(isRecord);
};

const isMetricSnapshot = function isMetricSnapshot(value: unknown): value is MetricSnapshot {
    return isRecord(value) && isGroupList(value["principles"]) && isGroupList(value["terms"]);
};

export const loadMetricSnapshot = async function loadMetricSnapshot(): Promise<MetricSnapshot> {
    const loaded: unknown = await import(ONTOLOGY_MODULE);
    const ontology = isRecord(loaded) ? loaded[ONTOLOGY_EXPORT] : null;
    if (!isMetricSnapshot(ontology)) {
        throw new TypeError(NO_METRIC_GROUPS);
    }
    return ontology;
};
