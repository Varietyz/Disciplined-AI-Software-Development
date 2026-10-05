import { describe, expect, it } from "vitest";
import { metricsOf, resolutionRate } from "@govlab/patterns/core/counters/report.counter.ts";

const THIRD = 0.33;

describe("the report counters", () => {
    it("resolutionRate is the resolved share to two places, and one for nothing to resolve", () => {
        expect(resolutionRate(1, 2)).toBeCloseTo(THIRD, 2);
        expect(resolutionRate(0, 0)).toBe(1);
    });

    it("metricsOf reports an empty scope as fully resolved with nothing tallied", () => {
        expect(metricsOf({ edges: [], findings: [], symbols: [], unresolved: 0 })).toStrictEqual({
            callable: 0,
            definitions: 0,
            edges: 0,
            exported: 0,
            findings: {},
            flows: {},
            maxInDegree: 0,
            maxOutDegree: 0,
            resolutionRate: 1,
            unresolvedCalls: 0,
        });
    });
});
