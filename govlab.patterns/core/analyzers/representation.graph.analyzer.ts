import type { Composition, LiftContext, NumericBounds, OrderedStats } from "#types/representation.types";
import { byCountDesc } from "#core/selectors/counter.selector";

const PAIR = 2;
const BANDS = 3;
const MIN_PATTERN = 2;

export const MEMBER_SEP = "␟";

export const combinations2 = function combinations2(members: readonly string[]): string[][] {
    return members.flatMap((a, i) => members.slice(i + 1).map((b) => [a, b]));
};

const numericBounds = function numericBounds(numeric: ReadonlyMap<number, number>): NumericBounds {
    let total = 0;
    let weighted = 0;
    let low = Infinity;
    let high = -Infinity;
    for (const [value, count] of numeric) {
        total += count;
        weighted += value * count;
        low = Math.min(low, value);
        high = Math.max(high, value);
    }
    return { high, low, total, weighted };
};

const fillBands = function fillBands(numeric: ReadonlyMap<number, number>, low: number, span: number): number[] {
    const bands = [0, 0, 0];
    for (const [value, count] of numeric) {
        const band = span === 0 ? 0 : Math.min(Math.floor(((value - low) / span) * BANDS), BANDS - 1);
        bands[band] = (bands[band] ?? 0) + count;
    }
    return bands;
};

export const orderedOf = function orderedOf(
    numeric: ReadonlyMap<number, number>,
    adjacent: number,
    listRecords: number,
): OrderedStats | null {
    const { low, high, total, weighted } = numericBounds(numeric);
    if (total === 0) {
        return null;
    }
    const span = high - low;
    const midpoint = (low + high) / PAIR;
    const symmetry = span > 0 ? 1 - Math.abs(weighted / total - midpoint) / (span / PAIR) : 1;
    return { adjacencyRate: listRecords ? adjacent / listRecords : 0, bands: fillBands(numeric, low, span), symmetry };
};

export const compositionOf = function compositionOf(numeric: ReadonlyMap<number, number>): Composition | null {
    const { low, high, total } = numericBounds(numeric);
    if (total === 0) {
        return null;
    }
    const midpoint = (low + high) / PAIR;
    let odd = 0;
    let above = 0;
    for (const [value, count] of numeric) {
        odd += Number.isInteger(value) && value % PAIR !== 0 ? count : 0;
        above += value > midpoint ? count : 0;
    }
    return { highRatio: above / total, oddRatio: odd / total };
};

export const countAdjacent = function countAdjacent(values: readonly number[]): number {
    return values.slice(1).filter((next, index) => next - (values[index] ?? next) === 1).length;
};

export const positionalOf = function positionalOf(
    positions: ReadonlyMap<number, Map<string, number>>,
): [number, string, number][] {
    return [...positions.keys()]
        .sort((a, b) => a - b)
        .map((index): [number, string, number] => {
            const [value, count] = [...(positions.get(index) ?? new Map<string, number>()).entries()].sort(
                byCountDesc,
            )[0] ?? ["", 0];
            return [index, value, count];
        });
};

export const liftOf = function liftOf(
    pairs: ReadonlyMap<string, number>,
    members: ReadonlyMap<string, number>,
    context: LiftContext,
): [string[], number][] {
    if (context.records === 0) {
        return [];
    }
    const scored = [...pairs.entries()].map(([key, observed]): [string[], number] => {
        const [a = "", b = ""] = key.split(MEMBER_SEP);
        return [[a, b], (observed * context.records) / ((members.get(a) ?? 1) * (members.get(b) ?? 1))];
    });
    return scored
        .toSorted((x, y) => y[1] - x[1] || x[0].join(",").localeCompare(y[0].join(",")))
        .slice(0, context.limit);
};

export const topPairsOf = function topPairsOf(pairs: ReadonlyMap<string, number>, limit: number): [string[], number][] {
    return [...pairs.entries()]
        .sort(byCountDesc)
        .slice(0, limit)
        .map(([key, count]): [string[], number] => [key.split(MEMBER_SEP), count]);
};

export const slotPatternsOf = function slotPatternsOf(
    slots: ReadonlyMap<string, number>,
    limit: number,
): [number, string, string, number][] {
    return [...slots.entries()]
        .sort(byCountDesc)
        .slice(0, limit)
        .filter(([, count]) => count >= MIN_PATTERN)
        .map(([key, count]): [number, string, string, number] => {
            const [index = "", left = "", right = ""] = key.split(MEMBER_SEP);
            return [Number(index), left, right, count];
        });
};
