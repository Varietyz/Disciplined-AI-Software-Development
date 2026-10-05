import type { Indices, QualityQueryFilter } from "#types/quality.types";
import type { QualityConcern } from "#types/catalog.types";

type MatchCheck = (indices: Indices, concern: QualityConcern, filter: QualityQueryFilter) => boolean;

const MATCH_CHECKS: readonly MatchCheck[] = [
    (_indices, concern, filter): boolean => filter.numeric === undefined || concern.numeric === filter.numeric,
    (_indices, concern, filter): boolean =>
        filter.crossTool === undefined || concern.toolCount > 1 === filter.crossTool,
    (_indices, concern, filter): boolean =>
        filter.hasConfigOptions === undefined || Boolean(concern.configOptions?.length) === filter.hasConfigOptions,
    (_indices, concern, filter): boolean =>
        typeof filter.minValue !== "number" || (typeof concern.value === "number" && concern.value >= filter.minValue),
    (indices, concern, filter): boolean =>
        typeof filter.tool !== "string" || (indices.concernTools.get(concern.id)?.has(filter.tool) ?? false),
    (indices, concern, filter): boolean =>
        typeof filter.ecosystem !== "string" ||
        (indices.concernEcosystems.get(concern.id)?.has(filter.ecosystem) ?? false),
];

export const matchesFilter = function matchesFilter(
    indices: Indices,
    concern: QualityConcern,
    filter: QualityQueryFilter,
): boolean {
    return MATCH_CHECKS.every((check) => check(indices, concern, filter));
};
