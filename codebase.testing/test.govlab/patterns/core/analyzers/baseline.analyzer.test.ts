import {
    autocorrelationSignificance,
    chiSquareSf,
    erf,
    erfc,
    normalSignificance,
    transitionIndependence,
    uniformity,
} from "@govlab/patterns/core/analyzers/baseline.analyzer.ts";
import { describe, expect, it } from "vitest";

const DIGITS_EXACT = 6;
const DIGITS_APPROX = 5;
const ERF_ONE = 0.8427008;
const ERFC_TWO = 0.0046777;
const TWO = 2;
const FAR = 4;
const MANY = 90;
const FEW = 10;
const SHORT = 2;
const LONG = 100;

describe("the error function", () => {
    it("matches known values within the Abramowitz-Stegun tolerance", () => {
        expect(erf(0)).toBeCloseTo(0, DIGITS_EXACT);
        expect(erfc(0)).toBeCloseTo(1, DIGITS_EXACT);
        expect(erf(1)).toBeCloseTo(ERF_ONE, DIGITS_APPROX);
        expect(erf(-1)).toBeCloseTo(-ERF_ONE, DIGITS_APPROX);
        expect(erfc(TWO)).toBeCloseTo(ERFC_TWO, DIGITS_APPROX);
    });
});

describe("the null models", () => {
    it("normalSignificance flags a distant z-score and clears a central one", () => {
        expect(normalSignificance(FAR).significant).toBe(true);
        expect(normalSignificance(0).significant).toBe(false);
    });

    it("chiSquareSf is one for a degenerate statistic and falls as the statistic grows", () => {
        expect(chiSquareSf(0, 1)).toBe(1);
        expect(chiSquareSf(LONG, 1)).toBeLessThan(chiSquareSf(1, 1));
    });

    it("autocorrelationSignificance refuses a series too short to judge", () => {
        expect(autocorrelationSignificance(1, SHORT).significant).toBe(false);
        expect(autocorrelationSignificance(1, LONG).significant).toBe(true);
    });

    it("transitionIndependence is insignificant with no transitions", () => {
        expect(transitionIndependence([]).significant).toBe(false);
    });

    it("uniformity declares one category uniform and bounds a skewed p-value", () => {
        expect(uniformity(new Map([["only", 1]])).uniform).toBe(true);
        const skewed = uniformity(
            new Map([
                ["a", MANY],
                ["b", FEW],
            ]),
        );
        expect(skewed.uniform).toBe(false);
        expect(skewed.pValue).toBeGreaterThanOrEqual(0);
    });
});
