import type { Compressibility } from "#types/information.types";
import { sumOf } from "#core/counters/base.counter";

const BITS_PER_BYTE = 8;

export const entropyBits = function entropyBits(counts: Iterable<number>, total: number): number {
    if (total === 0) {
        return 0;
    }
    let entropy = 0;
    for (const count of counts) {
        const probability = count / total;
        entropy -= probability * Math.log2(probability);
    }
    return entropy;
};

const ratioOf = function ratioOf(transitions: ReadonlyMap<string, Map<string, number>>): number {
    let weighted = 0;
    let total = 0;
    for (const row of transitions.values()) {
        const rowTotal = sumOf(row.values());
        weighted += rowTotal * entropyBits(row.values(), rowTotal);
        total += rowTotal;
    }
    return total === 0 ? 0 : Math.min(1, weighted / total / BITS_PER_BYTE);
};

const rowFor = function rowFor(transitions: Map<string, Map<string, number>>, key: string): Map<string, number> {
    const existing = transitions.get(key);
    if (existing) {
        return existing;
    }
    const created = new Map<string, number>();
    transitions.set(key, created);
    return created;
};

export const createCompressibility = function createCompressibility(): Compressibility {
    const transitions = new Map<string, Map<string, number>>();
    let previous = "";
    let started = false;
    const observe = function observe(symbol: string): void {
        if (started) {
            const row = rowFor(transitions, previous);
            row.set(symbol, (row.get(symbol) ?? 0) + 1);
        }
        previous = symbol;
        started = true;
    };
    return {
        push(...chunks: readonly string[]): void {
            for (const text of chunks) {
                for (const symbol of text) {
                    observe(symbol);
                }
            }
        },
        ratio(): number {
            return ratioOf(transitions);
        },
    };
};
