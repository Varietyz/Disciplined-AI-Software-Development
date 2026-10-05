import type { GroupSummary, PeerGroup, RateRecord } from "#types/rate.types";
import {
    HALF,
    NINE_TENTHS,
    PERCENT,
    QUARTER,
    SECONDS_PER_MONTH,
    THREE_QUARTERS,
} from "#configuration/constants/rate.constants";

const inGroup = function inGroup(record: RateRecord, group: PeerGroup): boolean {
    const titled = group.titles.length === 0 || record.titles.some((title) => group.titles.includes(title));
    const senior =
        group.seniorities.length === 0 || record.seniorities.some((level) => group.seniorities.includes(level));
    return titled && senior;
};

const quantile = function quantile(sorted: readonly number[], share: number): number {
    return sorted[Math.min(sorted.length - 1, Math.floor(share * (sorted.length - 1)))] ?? 0;
};

export const summarize = function summarize(
    records: readonly RateRecord[],
    group: PeerGroup,
    rate: number | null,
): GroupSummary {
    const sorted = records
        .filter((record) => inGroup(record, group))
        .map((record) => record.rate)
        .toSorted((left, right) => left - right);
    const below = rate === null || sorted.length === 0 ? null : sorted.filter((value) => value < rate).length;
    return {
        below: below === null ? null : Math.round((below / sorted.length) * PERCENT),
        count: sorted.length,
        highest: sorted.at(-1) ?? 0,
        label: group.label,
        median: quantile(sorted, HALF),
        p25: quantile(sorted, QUARTER),
        p75: quantile(sorted, THREE_QUARTERS),
        p90: quantile(sorted, NINE_TENTHS),
    };
};

export const withinMonths = function withinMonths(
    records: readonly RateRecord[],
    months: number,
): readonly RateRecord[] {
    const newest = Math.max(...records.map((record) => record.createdAt));
    return records.filter((record) => record.createdAt >= newest - months * SECONDS_PER_MONTH);
};
