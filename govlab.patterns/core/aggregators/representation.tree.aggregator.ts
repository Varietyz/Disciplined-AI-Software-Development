import { pickIndex, topEntries, weightedChoice } from "#core/selectors/counter.selector";
import type { Rng } from "#types/seed.types";
import type { TreeSummary } from "#types/representation.types";
import { foldRecords } from "#core/selectors/record.selector";
import { increment } from "#core/counters/base.counter";
import { isRecord } from "#core/predicates/record.predicate";

const DEFAULT_TOP = 10;
const SHAPE_SEP = "|";
const PATH_SEP = ".";
const INT_BOUND = 1000;
const HALF = 0.5;
const STRING_LEAF = "str";
const STRING_PREFIX = "s";

const TYPE_NAMES: ReadonlyMap<string, string> = new Map([
    ["boolean", "bool"],
    ["string", STRING_LEAF],
]);

const SYNTH: ReadonlyMap<string, (rng: Rng) => unknown> = new Map<string, (rng: Rng) => unknown>([
    ["int", (rng): unknown => pickIndex(rng, INT_BOUND)],
    ["float", (rng): unknown => rng.next()],
    ["bool", (rng): unknown => rng.next() < HALF],
    ["list", (): unknown => []],
    ["null", (): unknown => null],
]);

const typeName = function typeName(value: unknown): string {
    if (value === null) {
        return "null";
    }
    if (Array.isArray(value)) {
        return "list";
    }
    if (typeof value === "number") {
        return Number.isInteger(value) ? "int" : "float";
    }
    return TYPE_NAMES.get(typeof value) ?? "dict";
};

const synthLeaf = function synthLeaf(kind: string, rng: Rng): unknown {
    const synth = SYNTH.get(kind);
    return synth === undefined ? `${STRING_PREFIX}${pickIndex(rng, INT_BOUND)}` : synth(rng);
};

const insertPath = function insertPath(node: Record<string, unknown>, keys: readonly string[], value: unknown): void {
    let cursor = node;
    for (const key of keys.slice(0, -1)) {
        const existing = cursor[key];
        const child = isRecord(existing) ? existing : {};
        cursor[key] = child;
        cursor = child;
    }
    const leaf = keys.at(-1);
    if (leaf !== undefined) {
        cursor[leaf] = value;
    }
};

export class TreeAccumulator {
    private readonly field: string;
    private readonly keys = new Map<string, number>();
    private readonly paths = new Map<string, number>();
    private readonly leafTypes = new Map<string, number>();
    private readonly shapes = new Map<string, number>();
    private currentShape = new Set<string>();
    private records = 0;
    private maxDepth = 0;
    private nodes = 0;
    private leaves = 0;
    private maxBranching = 0;

    public constructor(field: string) {
        this.field = field;
    }

    public update(chunk: readonly unknown[]): void {
        foldRecords(chunk, this.field, (value) => {
            this.observe(value);
        });
    }

    public sample(rng: Rng): Record<string, unknown> | null {
        if (this.shapes.size === 0) {
            return null;
        }
        const key = weightedChoice(rng, this.shapes) ?? "";
        const tree: Record<string, unknown> = {};
        const paths = key
            .split(SHAPE_SEP)
            .filter((part) => part.length > 0)
            .sort((a, b) => a.localeCompare(b));
        for (const path of paths) {
            insertPath(tree, path.split(PATH_SEP), synthLeaf(weightedChoice(rng, this.leafTypes) ?? STRING_LEAF, rng));
        }
        return tree;
    }

    public result(top = DEFAULT_TOP): TreeSummary {
        return {
            distinctShapes: this.shapes.size,
            field: this.field,
            keys: topEntries(this.keys, top),
            leafTypes: topEntries(this.leafTypes, top),
            maxBranching: this.maxBranching,
            maxDepth: this.maxDepth,
            paths: topEntries(this.paths, top),
            records: this.records,
            totalLeaves: this.leaves,
            totalNodes: this.nodes,
        };
    }

    private observe(value: unknown): void {
        if (!isRecord(value)) {
            return;
        }
        this.records += 1;
        this.currentShape = new Set<string>();
        this.maxDepth = Math.max(this.maxDepth, this.descend(value, "", 1));
        increment(this.shapes, [...this.currentShape].sort((a, b) => a.localeCompare(b)).join(SHAPE_SEP));
    }

    private descend(node: Record<string, unknown>, prefix: string, depth: number): number {
        this.nodes += 1;
        this.maxBranching = Math.max(this.maxBranching, Object.keys(node).length);
        let deepest = depth;
        for (const [key, child] of Object.entries(node)) {
            increment(this.keys, key);
            deepest = Math.max(deepest, this.visit(child, prefix === "" ? key : `${prefix}${PATH_SEP}${key}`, depth));
        }
        return deepest;
    }

    private visit(child: unknown, path: string, depth: number): number {
        if (isRecord(child)) {
            return this.descend(child, path, depth + 1);
        }
        this.leaves += 1;
        increment(this.paths, path);
        increment(this.leafTypes, typeName(child));
        this.currentShape.add(path);
        return depth;
    }
}
