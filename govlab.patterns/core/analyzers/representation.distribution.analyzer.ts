import type { DriftContext, Temporal } from "#types/representation.types";
import { byCountDesc } from "#core/selectors/counter.selector";
import { increment } from "#core/counters/base.counter";

const HALF = 0.5;
const YEAR_END = 4;
const MONTH_START = 5;
const MONTH_END = 7;
const ISO_LENGTH = 10;
const DATE_SEPARATOR = "-";
const DIGITS: ReadonlySet<string> = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

interface MonthBuckets {
    byMonth: Map<number, number>;
    moments: string[];
}

const byMagnitudeDesc = function byMagnitudeDesc(a: readonly [string, number], b: readonly [string, number]): number {
    return Math.abs(b[1]) - Math.abs(a[1]) || a[0].localeCompare(b[0]);
};

const isoMonth = function isoMonth(value: string): number | null {
    if (value.length !== ISO_LENGTH || value[YEAR_END] !== DATE_SEPARATOR || value[MONTH_END] !== DATE_SEPARATOR) {
        return null;
    }
    for (let i = 0; i < value.length; i += 1) {
        if (i !== YEAR_END && i !== MONTH_END && !DIGITS.has(value[i] ?? "")) {
            return null;
        }
    }
    return Number(value.slice(MONTH_START, MONTH_END));
};

const bucketMonths = function bucketMonths(counts: ReadonlyMap<string, number>): MonthBuckets | null {
    const byMonth = new Map<number, number>();
    const moments: string[] = [];
    for (const [value, count] of counts) {
        const month = isoMonth(value);
        if (month === null) {
            return null;
        }
        increment(byMonth, month, count);
        moments.push(value);
    }
    return { byMonth, moments };
};

export const temporalOf = function temporalOf(counts: ReadonlyMap<string, number>): Temporal | null {
    const bucketed = bucketMonths(counts);
    if (bucketed === null || bucketed.moments.length === 0) {
        return null;
    }
    const sorted = bucketed.moments.toSorted((a, b) => a.localeCompare(b));
    return {
        byMonth: [...bucketed.byMonth.entries()].sort((a, b) => a[0] - b[0]),
        first: sorted[0] ?? "",
        last: sorted.at(-1) ?? "",
    };
};

export const witnessesOf = function witnessesOf(
    top: readonly [string, number][],
    lastSeen: ReadonlyMap<string, number>,
): [string, number][] {
    return top.map(([value]): [string, number] => [value, lastSeen.get(value) ?? 0]);
};

export const overdueOf = function overdueOf(
    lastSeen: ReadonlyMap<string, number>,
    total: number,
    limit: number,
): [string, number][] {
    return [...lastSeen.entries()]
        .map(([value, index]): [string, number] => [value, total - 1 - index])
        .sort(byCountDesc)
        .slice(0, limit);
};

export const temperaturesOf = function temperaturesOf(
    counts: ReadonlyMap<string, number>,
    window: readonly string[],
    total: number,
): [string, number][] {
    const recent = new Map<string, number>();
    for (const value of window) {
        increment(recent, value);
    }
    return [...counts.entries()].map(([value, count]): [string, number] => [
        value,
        (recent.get(value) ?? 0) - (count / total) * window.length,
    ]);
};

export const driftOf = function driftOf(
    counts: ReadonlyMap<string, number>,
    context: DriftContext,
): [string, number][] {
    const { indexSum, total, limit } = context;
    if (total <= 1) {
        return [];
    }
    const midpoint = (total - 1) * HALF;
    const scored = [...counts.keys()].map((value): [string, number] => [
        value,
        ((indexSum.get(value) ?? 0) / (counts.get(value) ?? 1) - midpoint) / (total - 1),
    ]);
    return scored.toSorted(byMagnitudeDesc).slice(0, limit);
};
