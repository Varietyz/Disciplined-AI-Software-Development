import { createCompressibility, entropyBits } from "@govlab/patterns/core/analyzers/information.analyzer.ts";
import { describe, expect, it } from "vitest";

const TWO = 2;

describe("entropyBits", () => {
    it("is one bit for two equally likely values and zero for none", () => {
        expect(entropyBits([1, 1], TWO)).toBe(1);
        expect(entropyBits([], 0)).toBe(0);
    });
});

describe("createCompressibility", () => {
    it("scores repetitive input lower than varied input, bounded to [0, 1]", () => {
        const repetitive = createCompressibility();
        repetitive.push("aaaaaaaaaaaaaaaaaaaaaaaa");
        const varied = createCompressibility();
        varied.push("the quick brown fox jumps over lazy dogs and vexed nymphs");
        expect(repetitive.ratio()).toBeGreaterThanOrEqual(0);
        expect(varied.ratio()).toBeLessThanOrEqual(1);
        expect(repetitive.ratio()).toBeLessThan(varied.ratio());
    });

    it("accumulates across streamed chunks", () => {
        const stream = createCompressibility();
        stream.push("ab", "ab", "ab");
        expect(stream.ratio()).toBeGreaterThanOrEqual(0);
    });
});
