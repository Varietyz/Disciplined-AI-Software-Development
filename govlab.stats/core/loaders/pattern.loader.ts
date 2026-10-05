import { arrayField, field, numberField, stringField } from "#core/selectors/field.selector";
import { FINDINGS_FILE } from "#configuration/constants/pattern.constants";
import type { FindingsStats } from "#types/pattern.types";
import { TOP_MODULES } from "#configuration/constants/metric.constants";
import { isRecord } from "#core/predicates/record.predicate";
import path from "node:path";
import { readJson } from "#core/loaders/data.loader";

const countMap = function countMap(value: unknown): Map<string, number> {
    return new Map(isRecord(value) ? Object.keys(value).map((key) => [key, numberField(value, key, 0)]) : []);
};

export const collectFindings = function collectFindings(root: string): FindingsStats {
    const data = readJson(path.join(root, FINDINGS_FILE));
    const summary = field(data, "summary");
    const modules = arrayField(data, "modules");
    const withFindings = modules
        .map((entry) => ({ module: stringField(entry, "module"), total: numberField(entry, "total", 0) }))
        .filter((entry) => entry.total > 0)
        .toSorted((left, right) => right.total - left.total);
    return {
        byKind: countMap(field(summary, "byKind")),
        bySeverity: countMap(field(summary, "bySeverity")),
        modules: numberField(summary, "modules", modules.length),
        modulesWithFindings: withFindings.length,
        topModules: withFindings.slice(0, TOP_MODULES),
        total: numberField(summary, "findings", 0),
    };
};
