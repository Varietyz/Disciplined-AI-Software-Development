import {
    MEMBER_SEP,
    combinations2,
    compositionOf,
    countAdjacent,
    liftOf,
    orderedOf,
    positionalOf,
    slotPatternsOf,
    topPairsOf,
} from "#core/analyzers/representation.graph.analyzer";
import { topEntries, weightedSample } from "#core/selectors/counter.selector";
import type { GraphSummary } from "#types/representation.types";
import type { Rng } from "#types/seed.types";
import { foldRecords } from "#core/selectors/record.selector";
import { increment } from "#core/counters/base.counter";
import { uniformity } from "#core/analyzers/baseline.analyzer";

const DEFAULT_TOP = 10;

export class GraphAccumulator {
    private readonly field: string;
    private readonly members = new Map<string, number>();
    private readonly pairs = new Map<string, number>();
    private readonly numeric = new Map<number, number>();
    private readonly positions = new Map<number, Map<string, number>>();
    private readonly sets = new Set<string>();
    private readonly slots = new Map<string, number>();
    private records = 0;
    private listRecords = 0;
    private edges = 0;
    private maxDegree = 0;
    private adjacent = 0;
    private allNumeric = true;

    public constructor(field: string) {
        this.field = field;
    }

    public update(chunk: readonly unknown[]): void {
        foldRecords(chunk, this.field, (value) => {
            this.observe(value);
        });
    }

    public sample(rng: Rng): string[] {
        if (this.members.size === 0 || this.listRecords === 0) {
            return [];
        }
        return weightedSample(rng, this.members, Math.max(1, Math.round(this.edges / this.listRecords)));
    }

    public result(top = DEFAULT_TOP): GraphSummary {
        return {
            composition: this.allNumeric ? compositionOf(this.numeric) : null,
            distinctSets: this.sets.size,
            distinctTargets: this.members.size,
            edges: this.edges,
            field: this.field,
            maxDegree: this.maxDegree,
            meanDegree: this.records ? this.edges / this.records : 0,
            memberUniformity: uniformity(this.members),
            ordered: this.allNumeric ? orderedOf(this.numeric, this.adjacent, this.listRecords) : null,
            positional: positionalOf(this.positions),
            records: this.records,
            repeatRate: this.listRecords ? 1 - this.sets.size / this.listRecords : 0,
            slotPatterns: slotPatternsOf(this.slots, top),
            topLift: liftOf(this.pairs, this.members, { limit: top, records: this.records }),
            topMembers: topEntries(this.members, top),
            topPairs: topPairsOf(this.pairs, top),
        };
    }

    private observe(value: unknown): void {
        this.records += 1;
        if (!Array.isArray(value)) {
            return;
        }
        this.listRecords += 1;
        this.edges += value.length;
        this.maxDegree = Math.max(this.maxDegree, value.length);
        const members = [...new Set(value.map(String))].sort((a, b) => a.localeCompare(b));
        this.recordMembers(members);
        this.recordPositions(value.map(String));
        this.observeNumeric(new Set(value));
    }

    private recordMembers(members: readonly string[]): void {
        for (const member of members) {
            increment(this.members, member);
        }
        this.sets.add(members.join(MEMBER_SEP));
        for (const [a, b] of combinations2(members)) {
            increment(this.pairs, `${a}${MEMBER_SEP}${b}`);
        }
    }

    private recordPositions(items: readonly string[]): void {
        items.forEach((item, index) => {
            const counter = this.positions.get(index) ?? new Map<string, number>();
            this.positions.set(index, counter);
            increment(counter, item);
        });
        for (let i = 0; i + 1 < items.length; i += 1) {
            increment(this.slots, `${i}${MEMBER_SEP}${items[i]}${MEMBER_SEP}${items[i + 1]}`);
        }
    }

    private observeNumeric(distinct: ReadonlySet<unknown>): void {
        const numbers = [...distinct].filter((item): item is number => typeof item === "number");
        if (numbers.length !== distinct.size) {
            this.allNumeric = false;
            return;
        }
        const values = numbers.toSorted((a, b) => a - b);
        for (const value of values) {
            increment(this.numeric, value);
        }
        this.adjacent += countAdjacent(values);
    }
}
