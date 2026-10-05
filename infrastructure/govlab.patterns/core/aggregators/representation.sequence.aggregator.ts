import { byCountDesc, pickIndex } from "#core/selectors/counter.selector";
import type { Rng } from "#types/seed.types";
import type { SequenceSummary } from "#types/representation.types";
import type { Transition } from "#types/baseline.types";
import { asText } from "#core/converters/field.converter";
import { foldRecords } from "#core/selectors/record.selector";
import { increment } from "#core/counters/base.counter";
import { transitionIndependence } from "#core/analyzers/baseline.analyzer";

const DEFAULT_TOP = 10;
const SEP = "␟";

const transitionKey = function transitionKey(source: string, target: string): string {
    return `${source}${SEP}${target}`;
};

const splitKey = function splitKey(key: string): [string, string] {
    const [source = "", target = ""] = key.split(SEP);
    return [source, target];
};

export class SequenceAccumulator {
    private readonly field: string;
    private readonly distinctValues = new Set<string>();
    private readonly transitions = new Map<string, number>();
    private readonly runLengths = new Map<number, number>();
    private readonly outgoingMode = new Map<string, string>();
    private count = 0;
    private prev: string | null = null;
    private changes = 0;
    private run = 0;
    private longest = 0;
    private hits = 0;
    private trials = 0;

    public constructor(field: string) {
        this.field = field;
    }

    public update(chunk: readonly unknown[]): void {
        foldRecords(chunk, this.field, (value) => {
            this.observe(asText(value));
        });
    }

    public sample(rng: Rng): string | null {
        if (this.distinctValues.size === 0) {
            return null;
        }
        const sorted = [...this.distinctValues].sort((a, b) => a.localeCompare(b));
        return sorted[pickIndex(rng, sorted.length)] ?? null;
    }

    public result(top = DEFAULT_TOP): SequenceSummary {
        const pairs = this.count - 1;
        return {
            changeRatio: pairs > 0 ? this.changes / pairs : 0,
            count: this.count,
            distinct: this.distinctValues.size,
            field: this.field,
            lastValue: this.prev,
            longestRun: this.longest,
            markovAccuracy: this.trials === 0 ? 0 : this.hits / this.trials,
            meanRun: this.count > 0 ? this.count / (this.changes + 1) : 0,
            nextValue: this.outgoing().slice(0, top),
            runLengths: this.finalRuns(),
            topTransitions: [...this.transitions.entries()]
                .sort(byCountDesc)
                .slice(0, top)
                .map(([key, count]): [[string, string], number] => [splitKey(key), count]),
            transitionSignificance: transitionIndependence(
                [...this.transitions.entries()].map(([key, count]): Transition => {
                    const [source, target] = splitKey(key);
                    return { count, source, target };
                }),
            ),
        };
    }

    private observe(value: string): void {
        this.count += 1;
        this.distinctValues.add(value);
        if (this.prev === null) {
            this.run = 1;
        } else {
            this.recordTransition(this.prev, value);
            this.trackRun(this.prev, value);
        }
        this.longest = Math.max(this.longest, this.run);
        this.prev = value;
    }

    private recordTransition(source: string, target: string): void {
        this.score(source, target);
        const key = transitionKey(source, target);
        increment(this.transitions, key);
        const next = this.transitions.get(key) ?? 0;
        const best = this.outgoingMode.get(source) ?? "";
        if (!this.outgoingMode.has(source) || next > (this.transitions.get(transitionKey(source, best)) ?? 0)) {
            this.outgoingMode.set(source, target);
        }
    }

    private trackRun(source: string, target: string): void {
        if (source === target) {
            this.run += 1;
            return;
        }
        increment(this.runLengths, this.run);
        this.changes += 1;
        this.run = 1;
    }

    private score(source: string, target: string): void {
        if (this.outgoingMode.has(source)) {
            this.trials += 1;
            this.hits += this.outgoingMode.get(source) === target ? 1 : 0;
        }
    }

    private outgoing(): [string, number][] {
        return [...this.transitions.entries()]
            .map(([key, count]): [string, string, number] => [...splitKey(key), count])
            .filter(([source]) => source === this.prev)
            .map(([, target, count]): [string, number] => [target, count])
            .sort(byCountDesc);
    }

    private finalRuns(): [number, number][] {
        const runs = new Map(this.runLengths);
        if (this.count > 0) {
            increment(runs, this.run);
        }
        return [...runs.entries()].sort((a, b) => a[0] - b[0]);
    }
}
