import type { OutlierContext, VectorSummary } from "#types/representation.types";
import type { Rng } from "#types/seed.types";
import { foldRecords } from "#core/selectors/record.selector";
import { gaussian } from "#core/converters/math.converter";

const ANOMALY_K = 16;
const DEFAULT_LIMIT = 10;

const asNumber = function asNumber(value: unknown): number | null {
    if (typeof value === "number") {
        return value;
    }
    if (Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "number")) {
        return value.reduce((sum: number, item: number) => sum + item, 0);
    }
    return null;
};

const keepTop = function keepTop(heap: readonly [number, number][], entry: [number, number]): [number, number][] {
    const next = [...heap, entry];
    if (next.length <= ANOMALY_K) {
        return next;
    }
    const drop = next.reduce((minIndex, candidate, index) => {
        const current = next[minIndex];
        return current !== undefined && candidate[0] < current[0] ? index : minIndex;
    }, 0);
    return next.filter((_, index) => index !== drop);
};

const collectIndices = function collectIndices(
    low: readonly [number, number][],
    high: readonly [number, number][],
): Map<number, number> {
    const indexOf = new Map<number, number>();
    for (const [value, index] of high) {
        if (!indexOf.has(value)) {
            indexOf.set(value, index);
        }
    }
    for (const [negated, index] of low) {
        if (!indexOf.has(-negated)) {
            indexOf.set(-negated, index);
        }
    }
    return indexOf;
};

const outliersOf = function outliersOf(
    low: readonly [number, number][],
    high: readonly [number, number][],
    context: OutlierContext,
): [number, number, number][] {
    const { mean, stddev, limit } = context;
    if (stddev <= 0) {
        return [];
    }
    const scored = [...collectIndices(low, high).entries()].map(([value, index]): [number, number, number] => [
        value,
        (value - mean) / stddev,
        index,
    ]);
    return scored.toSorted((a, b) => Math.abs(b[1]) - Math.abs(a[1]) || a[0] - b[0]).slice(0, limit);
};

export class VectorAccumulator {
    private readonly field: string;
    private low: [number, number][] = [];
    private high: [number, number][] = [];
    private count = 0;
    private seen = 0;
    private sum = 0;
    private sumsq = 0;
    private minimum = Infinity;
    private maximum = -Infinity;
    private prev: number | null = null;
    private cross = 0;
    private consecutive = 0;

    public constructor(field: string) {
        this.field = field;
    }

    public update(chunk: readonly unknown[]): void {
        foldRecords(chunk, this.field, (value) => {
            this.observe(value);
        });
    }

    public sample(rng: Rng): number | null {
        if (this.count === 0) {
            return null;
        }
        const [mean, variance] = this.meanVariance();
        return gaussian(rng, mean, Math.sqrt(variance));
    }

    public result(limit = DEFAULT_LIMIT): VectorSummary {
        if (this.count === 0) {
            return {
                autocorrelation: 0,
                count: 0,
                field: this.field,
                maximum: 0,
                mean: 0,
                minimum: 0,
                outliers: [],
                stddev: 0,
            };
        }
        const [mean, variance] = this.meanVariance();
        const stddev = Math.sqrt(variance);
        const autocorrelation =
            this.consecutive > 0 && variance > 0 ? (this.cross / this.consecutive - mean * mean) / variance : 0;
        return {
            autocorrelation,
            count: this.count,
            field: this.field,
            maximum: this.maximum,
            mean,
            minimum: this.minimum,
            outliers: outliersOf(this.low, this.high, { limit, mean, stddev }),
            stddev,
        };
    }

    private observe(raw: unknown): void {
        const index = this.seen;
        this.seen += 1;
        const number = asNumber(raw);
        if (number === null) {
            return;
        }
        this.accumulate(number);
        this.high = keepTop(this.high, [number, index]);
        this.low = keepTop(this.low, [-number, index]);
    }

    private accumulate(number: number): void {
        this.count += 1;
        this.sum += number;
        this.sumsq += number * number;
        this.minimum = Math.min(this.minimum, number);
        this.maximum = Math.max(this.maximum, number);
        if (this.prev !== null) {
            this.cross += number * this.prev;
            this.consecutive += 1;
        }
        this.prev = number;
    }

    private meanVariance(): [number, number] {
        const mean = this.sum / this.count;
        return [mean, Math.max(this.sumsq / this.count - mean * mean, 0)];
    }
}
