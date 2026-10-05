import type { CanonicalConfig, CanonicalData } from "#types/canon.types";
import type { ConcernConfig, ConcernValue, ResolvedConcern } from "#types/concern.types";

const CONCERN_ALIAS: Readonly<Record<string, string>> = { spacing: "indentation" };

const numericValue = function numericValue(value: ConcernValue): number | null {
    if (typeof value === "number") {
        return value;
    }
    if (Array.isArray(value)) {
        const found = value.find((entry) => typeof entry === "number");
        if (typeof found === "number") {
            return found;
        }
    }
    return null;
};

const classifyConcerns = function classifyConcerns(
    concerns: ConcernConfig,
    kindById: Map<string, string>,
): { enabled: Record<string, boolean>; values: Record<string, number> } {
    const values: Record<string, number> = {};
    const enabled: Record<string, boolean> = {};
    for (const [concept, raw] of Object.entries(concerns)) {
        const id = CONCERN_ALIAS[concept] ?? concept;
        const numeric = numericValue(raw);
        const kind = kindById.get(id);
        if (kind === "value" && numeric !== null) {
            values[id] = numeric;
            continue;
        }
        if (kind === "rule-intent" && raw === true) {
            enabled[id] = true;
        }
    }
    return { enabled, values };
};

export const concernsToCanonicalConfig = function concernsToCanonicalConfig(
    concerns: ConcernConfig,
    data: CanonicalData,
): Partial<CanonicalConfig> {
    const kindById = new Map(data.settings.map((setting) => [setting.id, setting.kind] as const));
    const { enabled, values } = classifyConcerns(concerns, kindById);
    const out: Partial<CanonicalConfig> = {};
    if (Object.keys(values).length > 0) {
        out.values = values;
    }
    if (Object.keys(enabled).length > 0) {
        out.enabled = enabled;
    }
    return out;
};

export const parseConcernValue = function parseConcernValue(value: ConcernValue): ResolvedConcern {
    if (typeof value === "boolean") {
        return { exclude: !value };
    }
    if (typeof value === "number") {
        return { exclude: false, value };
    }
    if (typeof value === "string") {
        return { exclude: false, optionValue: [value] };
    }
    return { exclude: false, optionValue: value };
};

export const resolveConcernMap = function resolveConcernMap(concerns: ConcernConfig): Map<string, ResolvedConcern> {
    const resolved = new Map<string, ResolvedConcern>();
    for (const [concept, value] of Object.entries(concerns)) {
        resolved.set(concept, parseConcernValue(value));
    }
    return resolved;
};
