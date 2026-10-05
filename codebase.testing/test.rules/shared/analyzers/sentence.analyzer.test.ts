import { describe, expect, it } from "vitest";
import {
    isAgentlessPassive,
    isParticiple,
    joinsOf,
    longestOf,
    sentenceWordsOf,
    sentencesOf,
    shapeOf,
    shapesOf,
} from "@ssot/govlab/shared/analyzers/sentence.analyzer.ts";
import type { SentenceShape } from "@ssot/govlab/types/writing.types.ts";

describe("sentencesOf and sentenceWordsOf", () => {
    it("splits at terminal punctuation and keeps a trailing fragment", () => {
        expect(sentencesOf("One. Two! Three? Four")).toStrictEqual(["One.", "Two!", "Three?", "Four"]);
        expect(sentencesOf("   ")).toStrictEqual([]);
    });

    it("lowers the words of a sentence and keeps a hyphenated word whole", () => {
        expect(sentenceWordsOf("The gate-first order, stated.")).toStrictEqual([
            "the",
            "gate-first",
            "order",
            "stated",
        ]);
    });
});

describe("isParticiple and isAgentlessPassive", () => {
    it("recognizes a regular and an irregular participle and refuses the look-alikes", () => {
        expect(isParticiple("rejected")).toBe(true);
        expect(isParticiple("written")).toBe(true);
        expect(isParticiple("indeed")).toBe(false);
        expect(isParticiple("agreed")).toBe(false);
        expect(isParticiple("used")).toBe(true);
        expect(isParticiple("red")).toBe(false);
    });

    it("finds a passive with no agent, allows one adverb between the auxiliary and the participle, and clears one with an agent", () => {
        expect(isAgentlessPassive(sentenceWordsOf("The file is rejected."))).toBe(true);
        expect(isAgentlessPassive(sentenceWordsOf("The file is always rejected."))).toBe(true);
        expect(isAgentlessPassive(sentenceWordsOf("The file is rejected by the gate."))).toBe(false);
        expect(isAgentlessPassive(sentenceWordsOf("The gate rejects the file."))).toBe(false);
    });
});

describe("joinsOf, shapeOf, shapesOf and longestOf", () => {
    it("counts the coordinators and folds a text into shapes", () => {
        expect(joinsOf(sentenceWordsOf("Read it and fix it, then ship."))).toBe(2);
        const shape: SentenceShape = shapeOf("The file is rejected.");
        expect(shape).toStrictEqual({ agentlessPassive: true, joins: 0, words: 4 });
        const shapes = shapesOf("One two three. Four.");
        expect(shapes.map((entry) => entry.words)).toStrictEqual([3, 1]);
        expect(longestOf(shapes)).toBe(3);
        expect(longestOf([])).toBe(0);
    });
});
