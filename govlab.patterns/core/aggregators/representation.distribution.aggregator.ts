import { byCountDesc, topEntries, weightedChoice } from "#core/selectors/counter.selector";
import { createCompressibility, entropyBits } from "#core/analyzers/information.analyzer";
import {
    driftOf,
    overdueOf,
    temperaturesOf,
    temporalOf,
    witnessesOf,
} from "#core/analyzers/representation.distribution.analyzer";
import type { Compressibility } from "#types/information.types";
import type { DistributionSummary } from "#types/representation.types";
import type { Rng } from "#types/seed.types";
import { asText } from "#core/converters/field.converter";
import { foldRecords } from "#core/selectors/record.selector";
import { increment } from "#core/counters/base.counter";
import { uniformity } from "#core/analyzers/baseline.analyzer";

const DEFAULT_WINDOW = 50;
const DEFAULT_TOP = 10;

export class DistributionAccumulator {
    private readonly counts = new Map<string, number>();
    private readonly lastSeen = new Map<string, number>();
    private readonly indexSum = new Map<string, number>();
    private readonly window: string[] = [];
    private readonly compressor: Compressibility = createCompressibility();
    private readonly field: string;
    private readonly windowSize: number;
    private total = 0;
    private mode: string | null = null;
    private hits = 0;
    private trials = 0;

    public constructor(field: string, windowSize = DEFAULT_WINDOW) {
        this.field = field;
        this.windowSize = windowSize;
    }

    public update(chunk: readonly unknown[]): void {
        foldRecords(chunk, this.field, (value) => {
            if (value !== null) {
                this.observe(asText(value));
            }
        });
    }

    public sample(rng: Rng): string | null {
        return weightedChoice(rng, this.counts);
    }

    public result(top = DEFAULT_TOP): DistributionSummary {
        const temperatures = temperaturesOf(this.counts, this.window, this.total);
        const pairs = topEntries(this.counts, top);
        return {
            cold: temperatures.toSorted((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1)).slice(0, top),
            complexity: this.compressor.ratio(),
            count: this.total,
            distinct: this.counts.size,
            drift: driftOf(this.counts, { indexSum: this.indexSum, limit: top, total: this.total }),
            entropyBits: entropyBits(this.counts.values(), this.total),
            field: this.field,
            hot: temperatures.toSorted(byCountDesc).slice(0, top),
            modeAccuracy: this.trials === 0 ? 0 : this.hits / this.trials,
            overdue: overdueOf(this.lastSeen, this.total, top),
            temporal: temporalOf(this.counts),
            top: pairs,
            uniformity: uniformity(this.counts),
            witnesses: witnessesOf(pairs, this.lastSeen),
        };
    }

    private observe(value: string): void {
        this.trackMode(value);
        increment(this.counts, value);
        this.updateMode(value, this.counts.get(value) ?? 0);
        this.lastSeen.set(value, this.total);
        increment(this.indexSum, value, this.total);
        this.pushWindow(value);
        this.compressor.push(value);
        this.total += 1;
    }

    private trackMode(value: string): void {
        if (this.mode !== null) {
            this.trials += 1;
            if (this.mode === value) {
                this.hits += 1;
            }
        }
    }

    private updateMode(value: string, next: number): void {
        if (this.mode === null || next > (this.counts.get(this.mode) ?? 0)) {
            this.mode = value;
        }
    }

    private pushWindow(value: string): void {
        this.window.push(value);
        if (this.window.length > this.windowSize) {
            this.window.shift();
        }
    }
}
