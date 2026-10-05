import { describe, expect, it } from "vitest";
import {
    driftOf,
    overdueOf,
    temperaturesOf,
    temporalOf,
    witnessesOf,
} from "@govlab/patterns/core/analyzers/representation.distribution.analyzer.ts";

const FOUR = 4;
const JUNE = 6;

describe("the distribution analyzer", () => {
    it("temporalOf buckets ISO dates by month and refuses anything else", () => {
        const temporal = temporalOf(
            new Map([
                ["2026-06-01", 2],
                ["2026-01-15", 1],
            ]),
        );
        expect(temporal).toStrictEqual({
            byMonth: [
                [1, 1],
                [JUNE, 2],
            ],
            first: "2026-01-15",
            last: "2026-06-01",
        });
        expect(temporalOf(new Map([["red", 1]]))).toBeNull();
    });

    it("witnessesOf reports where each top value was last seen", () => {
        expect(witnessesOf([["a", 2]], new Map([["a", FOUR]]))).toStrictEqual([["a", FOUR]]);
    });

    it("overdueOf ranks values by how long since they appeared", () => {
        expect(
            overdueOf(
                new Map([
                    ["old", 0],
                    ["new", FOUR],
                ]),
                FOUR + 1,
                1,
            ),
        ).toStrictEqual([["old", FOUR]]);
    });

    it("temperaturesOf is positive for a value hot in the recent window", () => {
        const [[, heat] = ["", 0]] = temperaturesOf(new Map([["a", 1]]), ["a", "a"], FOUR);
        expect(heat).toBeGreaterThan(0);
    });

    it("driftOf is empty for a single record and signed by where a value sits", () => {
        expect(driftOf(new Map([["a", 1]]), { indexSum: new Map([["a", 0]]), limit: 1, total: 1 })).toStrictEqual([]);
        const [[, drift] = ["", 0]] = driftOf(new Map([["late", 1]]), {
            indexSum: new Map([["late", FOUR]]),
            limit: 1,
            total: FOUR + 1,
        });
        expect(drift).toBeGreaterThan(0);
    });
});
