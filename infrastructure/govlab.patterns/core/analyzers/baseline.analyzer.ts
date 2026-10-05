import type { Marginals, Significance, Transition, Uniformity } from "#types/baseline.types";
import { increment, sumOf } from "#core/counters/base.counter";

const A1 = 0.254829592;
const A2 = -0.284496736;
const A3 = 1.421413741;
const A4 = -1.453152027;
const A5 = 1.061405429;
const P = 0.3275911;
const ERFC_MAX = 2;
const ALPHA = 0.05;
const NINE = 9;
const THREE = 3;
const THIRD = 1 / THREE;
const MIN_SERIES = 3;
const HALF = 0.5;
const TWO = 2;
const SQUARE = 2;

const INSIGNIFICANT: Significance = { pValue: 1, significant: false, statistic: 0 };

export const erf = function erf(x: number): number {
    const sign = x < 0 ? -1 : 1;
    const ax = Math.abs(x);
    const t = 1 / (1 + P * ax);
    const y = 1 - ((((A5 * t + A4) * t + A3) * t + A2) * t + A1) * t * Math.exp(-ax * ax);
    return sign * y;
};

export const erfc = function erfc(x: number): number {
    return Math.min(ERFC_MAX, Math.max(0, 1 - erf(x)));
};

export const normalSignificance = function normalSignificance(z: number): Significance {
    const pValue = erfc(Math.abs(z) / Math.SQRT2);
    return { pValue, significant: pValue < ALPHA, statistic: z };
};

export const chiSquareSf = function chiSquareSf(statistic: number, dof: number): number {
    if (dof <= 0 || statistic <= 0) {
        return 1;
    }
    const cubeRoot = (statistic / dof) ** THIRD;
    const mean = 1 - TWO / (NINE * dof);
    const stddev = Math.sqrt(TWO / (NINE * dof));
    return HALF * erfc((cubeRoot - mean) / stddev / Math.SQRT2);
};

export const autocorrelationSignificance = function autocorrelationSignificance(
    correlation: number,
    count: number,
): Significance {
    return count < MIN_SERIES ? INSIGNIFICANT : normalSignificance(correlation * Math.sqrt(count));
};

const marginalsOf = function marginalsOf(transitions: readonly Transition[]): Marginals {
    const row = new Map<string, number>();
    const col = new Map<string, number>();
    for (const { source, target, count } of transitions) {
        increment(row, source, count);
        increment(col, target, count);
    }
    return { col, row };
};

const chiFromTransitions = function chiFromTransitions(
    transitions: readonly Transition[],
    marginals: Marginals,
    total: number,
): number {
    let sum = 0;
    for (const { source, target, count } of transitions) {
        const expected = (marginals.row.get(source) ?? 0) * (marginals.col.get(target) ?? 0);
        if (expected > 0) {
            sum += (count * count * total) / expected;
        }
    }
    return sum - total;
};

export const transitionIndependence = function transitionIndependence(
    transitions: readonly Transition[],
): Significance {
    const total = sumOf(transitions.map((transition) => transition.count));
    if (total === 0) {
        return INSIGNIFICANT;
    }
    const marginals = marginalsOf(transitions);
    const dof = (marginals.row.size - 1) * (marginals.col.size - 1);
    if (dof <= 0) {
        return INSIGNIFICANT;
    }
    const chi = chiFromTransitions(transitions, marginals, total);
    const pValue = chiSquareSf(chi, dof);
    return { pValue, significant: pValue < ALPHA, statistic: chi };
};

export const uniformity = function uniformity(counts: ReadonlyMap<string, number>): Uniformity {
    const categories = counts.size;
    const total = sumOf(counts.values());
    if (categories <= 1 || total === 0) {
        return { chiSquare: 0, dof: 0, pValue: 1, uniform: true };
    }
    const expected = total / categories;
    const statistic = sumOf([...counts.values()].map((count) => (count - expected) ** SQUARE / expected));
    const dof = categories - 1;
    const pValue = chiSquareSf(statistic, dof);
    return { chiSquare: statistic, dof, pValue, uniform: pValue >= ALPHA };
};
