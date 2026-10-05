import { buildPhraseIndex, matchPhrases } from "@banes-lab/web/core/matchers/vocabulary.matcher.ts";
import { describe, expect, it } from "vitest";
import type { VocabularyEntry } from "@banes-lab/web/types/vocabulary.types.ts";

const entry = function entry(phrase: string, ref: string, prose = true): VocabularyEntry {
    return { code: null, kind: "principle", layer: null, phrase, prose, ref };
};

const VOCABULARY: readonly VocabularyEntry[] = [
    entry("Fail Fast", "architecture:fail-fast"),
    entry("Bounded Lifetime", "lexicon:bounded-lifetime", false),
    entry("Single Responsibility Principle", "architecture:single-responsibility"),
    entry("Single Responsibility", "architecture:single-responsibility-short"),
    entry("Normalization", "architecture:normalization"),
    entry("Pure Functions", "architecture:pure-functions"),
    entry("Entity", "architecture:entity"),
    entry("Structural Core", "layer:structural-core"),
    entry("Consensus", "architecture:consensus"),
    entry("Quality Attributes", "architecture:quality-attributes"),
    entry("Assessment", "architecture:assessment"),
    entry("Detect, log, fix", "chapter:detect-log-fix"),
];

const INDEX = buildPhraseIndex(VOCABULARY);

const spans = function spans(text: string, seen = new Set<string>()): readonly string[] {
    return matchPhrases(text, INDEX, seen).map((match) => text.slice(match.start, match.end));
};

describe("matchPhrases", () => {
    it("matches whole phrases on word boundaries, hyphenated or spaced, once per record", () => {
        expect(spans("A fail-fast guard fails fast; fail fast again.")).toStrictEqual(["fail-fast"]);
        expect(spans("The failfast flag.")).toStrictEqual([]);
    });

    it("prefers the longest phrase at a position and honors the spelling fold", () => {
        expect(spans("The single responsibility principle and normalisation.")).toStrictEqual([
            "single responsibility principle",
            "normalisation",
        ]);
        expect(spans("A pure function is enough.")).toStrictEqual(["pure function"]);
    });

    it("never matches inside a tag, an existing link or a code span, and never across sentence punctuation", () => {
        expect(
            spans('<a href="/x">fail fast</a> and <code>fail fast</code> and <em>pure functions</em>'),
        ).toStrictEqual(["pure functions"]);
        expect(spans("It will fail. Fast code follows.")).toStrictEqual([]);
    });

    it("skips a record already seen in the same scope and skips an ambiguous single word", () => {
        const seen = new Set(["architecture:fail-fast"]);
        expect(spans("Fail fast and pure functions.", seen)).toStrictEqual(["pure functions"]);
        expect(spans("An entity is a thing.")).toStrictEqual([]);
        expect(INDEX.byFirstWord.get("entity")).toHaveLength(1);
        expect(spans("A bounded lifetime is a term, not a principle.")).toStrictEqual([]);
        expect(INDEX.byFirstWord.get("bounded")).toHaveLength(1);
        expect(spans("The structural core layer.")).toStrictEqual(["structural core"]);
    });

    it("holds the ambiguous guard against the same fold the tokens get, single words and phrases alike", () => {
        expect(spans("They reached consensus quickly.")).toStrictEqual([]);
        expect(spans("A quality attribute is a degree; the quality attributes model lists them.")).toStrictEqual([]);
    });

    it("matches a title across the commas it carries, and nowhere else across a comma", () => {
        expect(spans("What a finding holds is described in detect, log, fix.")).toStrictEqual(["detect, log, fix"]);
        expect(spans("It stays pure, functions aside.")).toStrictEqual([]);
    });

    it("never matches a word that a hyphen binds into a compound", () => {
        expect(spans("A pre-normalisation pass runs first, then normalisation proper.")).toStrictEqual([
            "normalisation",
        ]);
        expect(spans("Pure-functions-only code; pure functions elsewhere.")).toStrictEqual(["pure functions"]);
        expect(spans("A model's self-assessment is not evidence.")).toStrictEqual([]);
    });
});
