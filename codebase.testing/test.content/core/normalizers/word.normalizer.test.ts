import {
    countAny,
    countTerm,
    digitMetricsOf,
    isDigitMetric,
    lowerWordsOf,
    wordsOf,
} from "@banes-lab/content/core/normalizers/word.normalizer.ts";
import { describe, expect, it } from "vitest";

const UNITS = ["ms", "s", "%"];

describe("wordsOf and lowerWordsOf", () => {
    it("splits on punctuation and whitespace and lowers on request", () => {
        expect(wordsOf("Read the file, then Verify.")).toStrictEqual(["Read", "the", "file", "then", "Verify"]);
        expect(lowerWordsOf("A B")).toStrictEqual(["a", "b"]);
    });
});

describe("countTerm and countAny", () => {
    it("matches a term only at word boundaries", () => {
        expect(countTerm("a novel idea; novelty is not novel", "novel")).toBe(2);
        expect(countAny("robust and elegant, robustly", ["robust", "elegant"])).toBe(2);
    });
});

describe("isDigitMetric and digitMetricsOf", () => {
    it("recognizes a number followed by a unit and nothing else", () => {
        expect(isDigitMetric("300ms", UNITS)).toBe(true);
        expect(isDigitMetric("40%", UNITS)).toBe(true);
        expect(isDigitMetric("ms", UNITS)).toBe(false);
        expect(isDigitMetric("files", UNITS)).toBe(false);
        expect(digitMetricsOf("300ms and 2.5s but not 150 lines", UNITS)).toBe(2);
    });
});
