import type { Rng } from "#types/seed.types";
import { sumOf } from "#core/counters/base.counter";

export const byCountDesc = function byCountDesc(a: readonly [string, number], b: readonly [string, number]): number {
    return b[1] - a[1] || a[0].localeCompare(b[0]);
};

export const topEntries = function topEntries(counter: ReadonlyMap<string, number>, limit: number): [string, number][] {
    return [...counter.entries()].sort(byCountDesc).slice(0, limit);
};

export const pickIndex = function pickIndex(rng: Rng, length: number): number {
    return Math.floor(rng.next() * length);
};

const pick = function pick(weights: ReadonlyMap<string, number>, threshold: number): string | null {
    let remaining = threshold;
    let last: string | null = null;
    for (const [key, weight] of weights) {
        last = key;
        remaining -= weight;
        if (remaining < 0) {
            return key;
        }
    }
    return last;
};

export const weightedChoice = function weightedChoice(rng: Rng, weights: ReadonlyMap<string, number>): string | null {
    const total = sumOf(weights.values());
    return total <= 0 ? null : pick(weights, rng.next() * total);
};

export const weightedSample = function weightedSample(
    rng: Rng,
    weights: ReadonlyMap<string, number>,
    size: number,
): string[] {
    const pool = new Map(weights);
    const drawn: string[] = [];
    while (drawn.length < size && pool.size > 0) {
        const picked = weightedChoice(rng, pool);
        if (picked === null) {
            return drawn;
        }
        drawn.push(picked);
        pool.delete(picked);
    }
    return drawn;
};
