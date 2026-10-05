import { describe, expect, it } from "vitest";
import { measureLiterals } from "@banes-lab/content/core/analyzers/tone.analyzer.ts";

const LITERALS = [
    "Planning saves debugging time. I interrupt drift; you verify the result.",
    "**Focused questions** — AI handles focused questions more reliably.",
    "A robust, paradigm-shifting script caused a 300ms regression and a 40% slowdown.",
    "We publish the method",
    "The file is rejected. Read the report and fix the finding, then run the gate and ship.",
];

describe("measureLiterals", () => {
    const metrics = measureLiterals("fixture.strings.ts", LITERALS);

    it("counts literals, sentences and words", () => {
        expect(metrics.literals).toBe(LITERALS.length);
        expect(metrics.sentences).toBe(7);
        expect(metrics.words).toBeGreaterThan(20);
    });

    it("measures the sentence shapes the writing policy watches", () => {
        expect(metrics.longestSentence).toBe(13);
        expect(metrics.agentlessPassives).toBe(1);
        expect(metrics.chainedSentences).toBe(1);
    });

    it("counts the punctuation the policy watches", () => {
        expect(metrics.longDashes).toBe(1);
        expect(metrics.semicolons).toBe(1);
        expect(metrics.digitMetrics).toBe(2);
    });

    it("counts banned terms at word boundaries", () => {
        expect(metrics.bannedTerms).toBe(2);
    });

    it("counts the person markers separately", () => {
        expect(metrics.firstPerson).toBe(1);
        expect(metrics.secondPerson).toBe(1);
        expect(metrics.collectivePerson).toBe(1);
    });

    it("counts a bold label followed by a separator as a labeled item", () => {
        expect(metrics.labeledItems).toBe(1);
    });
});
