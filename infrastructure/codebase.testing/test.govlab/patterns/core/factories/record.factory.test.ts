import { describe, expect, it } from "vitest";
import { synthesize } from "@govlab/patterns/core/factories/record.factory.ts";

const COUNT = 5;
const SEED = 7;
const S1 = 3;
const S2 = 7;

const records = function records(): Record<string, unknown>[] {
    return [
        { color: "red", score: S1 },
        { color: "blue", score: S2 },
    ];
};

describe("synthesize", () => {
    it("draws structure-preserving records, reproducible under a fixed seed", () => {
        const first = synthesize(records(), { count: COUNT, seed: SEED });
        expect(first).toHaveLength(COUNT);
        expect(first).toStrictEqual(synthesize(records(), { count: COUNT, seed: SEED }));
        expect(Object.keys(first[0] ?? {}).sort((a, b) => a.localeCompare(b))).toStrictEqual(["color", "score"]);
    });

    it("returns an empty set when nothing is analyzable", () => {
        expect(synthesize([], { count: COUNT })).toStrictEqual([]);
        expect(synthesize([{ a: null }, { a: null }], { count: COUNT })).toStrictEqual([]);
    });
});
