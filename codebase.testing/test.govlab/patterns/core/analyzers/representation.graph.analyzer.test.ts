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
} from "@govlab/patterns/core/analyzers/representation.graph.analyzer.ts";
import { describe, expect, it } from "vitest";

const THREE = 3;
const HALF = 0.5;

const pair = function pair(a: string, b: string): string {
    return `${a}${MEMBER_SEP}${b}`;
};

describe("the graph analyzer", () => {
    it("combinations2 lists every unordered pair once", () => {
        expect(combinations2(["a", "b", "c"])).toStrictEqual([
            ["a", "b"],
            ["a", "c"],
            ["b", "c"],
        ]);
    });

    it("countAdjacent counts consecutive integer steps", () => {
        expect(countAdjacent([1, 2, THREE, THREE + 2])).toBe(2);
    });

    it("orderedOf and compositionOf describe a numeric member domain, and nothing for an empty one", () => {
        const numeric = new Map([
            [1, 1],
            [THREE, 1],
        ]);
        expect(orderedOf(numeric, 0, 1)?.symmetry).toBe(1);
        expect(compositionOf(numeric)).toStrictEqual({ highRatio: HALF, oddRatio: 1 });
        expect(orderedOf(new Map(), 0, 0)).toBeNull();
        expect(compositionOf(new Map())).toBeNull();
    });

    it("positionalOf picks the modal value at each list position", () => {
        const slot = new Map([
            ["a", 2],
            ["b", 1],
        ]);
        expect(positionalOf(new Map([[0, slot]]))).toStrictEqual([[0, "a", 2]]);
    });

    it("liftOf scores a pair against the independence baseline", () => {
        const [[members, lift] = [[], 0]] = liftOf(
            new Map([[pair("a", "b"), 1]]),
            new Map([
                ["a", 1],
                ["b", 1],
            ]),
            { limit: 1, records: 2 },
        );
        expect(members).toStrictEqual(["a", "b"]);
        expect(lift).toBe(2);
    });

    it("topPairsOf and slotPatternsOf split their keys back into parts", () => {
        const pairs = new Map([[pair("a", "b"), 2]]);
        expect(topPairsOf(pairs, 1)).toStrictEqual([[["a", "b"], 2]]);
        expect(slotPatternsOf(new Map([[`0${MEMBER_SEP}a${MEMBER_SEP}b`, 2]]), 1)).toStrictEqual([[0, "a", "b", 2]]);
    });
});
