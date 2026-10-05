import { AMERICAN_WORDS, IZE_STEMS, IZE_SUFFIXES } from "@govlab/constants/configuration/constants/word.constants.ts";
import { americanOf, normalizeWord } from "@govlab/constants/core/normalizers/word.normalizer.ts";
import { describe, expect, it } from "vitest";

describe("americanOf", () => {
    it("spells a listed British word the American way", () => {
        expect(americanOf("behaviour")).toBe("behavior");
        expect(americanOf("practise")).toBe("practice");
    });

    it("rewrites an -ise ending only after a declared stem", () => {
        expect(americanOf("normalisation")).toBe("normalization");
        expect(americanOf("prioritised")).toBe("prioritized");
        expect(americanOf("rise")).toBe("rise");
        expect(americanOf("wise")).toBe("wise");
        expect(americanOf("capitalised")).toBe("capitalized");
        expect(americanOf("customisation")).toBe("customization");
        expect(americanOf("apologising")).toBe("apologizing");
        expect(americanOf("capitalist")).toBe("capitalist");
        expect(americanOf("customs")).toBe("customs");
    });

    it("spells a listed doubled consonant and -our ending the American way", () => {
        expect(americanOf("travelling")).toBe("traveling");
        expect(americanOf("signalling")).toBe("signaling");
        expect(americanOf("humour")).toBe("humor");
        expect(americanOf("rigour")).toBe("rigor");
    });

    it("rewrites an -ise ending after one declared prefix and a declared stem", () => {
        expect(americanOf("centralised")).toBe("centralized");
        expect(americanOf("decentralisation")).toBe("decentralization");
        expect(americanOf("denormalised")).toBe("denormalized");
        expect(americanOf("precise")).toBe("precise");
        expect(americanOf("compromise")).toBe("compromise");
    });

    it("spells a listed British word after one declared prefix", () => {
        expect(americanOf("mislabelled")).toBe("mislabeled");
        expect(americanOf("unhonoured")).toBe("unhonored");
        expect(americanOf("decolour")).toBe("decolor");
        expect(americanOf("undertraveled")).toBe("undertraveled");
    });

    it("leaves a word that is a key of every object untouched", () => {
        expect(americanOf("constructor")).toBe("constructor");
        expect(americanOf("four")).toBe("four");
    });
});

describe("normalizeWord", () => {
    it("lowercases, spells the American way and folds a plural", () => {
        expect(normalizeWord("Normalisations")).toBe("normalization");
        expect(normalizeWord("behaviours")).toBe("behavior");
        expect(normalizeWord("Functions")).toBe("function");
        expect(normalizeWord("Policies")).toBe("policy");
        expect(normalizeWord("registries")).toBe("registry");
    });

    it("rewrites a British suffix only after a listed stem, so a word that merely ends the same way keeps its spelling", () => {
        expect(normalizeWord("recognisable")).toBe("recognizable");
        expect(normalizeWord("disable")).toBe("disable");
        expect(normalizeWord("advise")).toBe("advise");
        expect(normalizeWord("exercise")).toBe("exercise");
    });

    it("keeps an ending that only looks like a plural, and a short word", () => {
        expect(normalizeWord("Consensus")).toBe("consensus");
        expect(normalizeWord("status")).toBe("status");
        expect(normalizeWord("analysis")).toBe("analysis");
        expect(normalizeWord("process")).toBe("process");
        expect(normalizeWord("was")).toBe("was");
        expect(normalizeWord("bus")).toBe("bus");
        expect(normalizeWord("S")).toBe("s");
    });

    it("spells a word again after folding its plural, so a British plural reaches the American singular", () => {
        expect(normalizeWord("offences")).toBe("offense");
        expect(normalizeWord("practises")).toBe("practice");
    });

    it("returns a fixed point, so folding a folded word changes nothing", () => {
        const stemmed = IZE_STEMS.flatMap((stem) => Object.keys(IZE_SUFFIXES).map((suffix) => stem + suffix));
        const words = [...Object.keys(AMERICAN_WORDS), ...Object.values(AMERICAN_WORDS), ...stemmed];
        const plurals = words.flatMap((word) => [word, `${word}s`, `${word}es`]);
        expect(plurals.filter((word) => normalizeWord(normalizeWord(word)) !== normalizeWord(word))).toStrictEqual([]);
    });
});
