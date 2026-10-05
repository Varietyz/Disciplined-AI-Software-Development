import {
    COMMENT_OPENERS,
    FIELD_OVERLAP,
    FILLER_PHRASES,
    FUNCTION_WORDS,
    INDEFINITE_PARTIES,
    LABELING_OPENERS,
    LABEL_MAX_WORDS,
    PLURAL_MARK,
    QUOTE_CLOSE,
    QUOTE_OPEN,
    RESTATEMENT_MIN_WORDS,
    SENTENCE_OVERLAP,
    STEM_MIN_LENGTH,
} from "../manifests/composition.manifest.ts";
import { sentenceWordsOf, sentencesOf } from "./sentence.analyzer.ts";
import type { CompositionFinding } from "../../types/writing.types.ts";

const TAG_OPEN = "<";
const TAG_CLOSE = ">";
const SPACE = " ";
const DOUBLE_PLURAL = "ss";

export const withoutTags = function withoutTags(text: string): string {
    let output = "";
    let inside = false;
    for (const char of text) {
        const opens = char === TAG_OPEN;
        const closes: boolean = !opens && inside && char === TAG_CLOSE;
        output += opens ? SPACE : "";
        output += opens || closes || inside ? "" : char;
        inside = opens || (inside && !closes);
    }
    return output;
};

const opensWith = function opensWith(words: readonly string[], phrase: readonly string[]): boolean {
    return phrase.every((word, at) => words[at] === word);
};

const holds = function holds(words: readonly string[], phrase: readonly string[]): boolean {
    return words.some((_, start) => phrase.every((word, at) => words[start + at] === word));
};

const labelsOnly = function labelsOnly(words: readonly string[], phrase: readonly string[]): boolean {
    const labeling = LABELING_OPENERS.some((opener) => opener.length === phrase.length && opensWith(phrase, opener));
    return !labeling || words.length - phrase.length <= LABEL_MAX_WORDS;
};

export const commentOpenerOf = function commentOpenerOf(words: readonly string[]): string | null {
    const hit = COMMENT_OPENERS.find((phrase) => opensWith(words, phrase) && labelsOnly(words, phrase));
    return hit === undefined ? null : hit.join(SPACE);
};

export const fillerOf = function fillerOf(words: readonly string[]): string | null {
    const hit = FILLER_PHRASES.find((phrase) => holds(words, phrase));
    return hit === undefined ? null : hit.join(SPACE);
};

export const partyOf = function partyOf(words: readonly string[]): string | null {
    const hit = INDEFINITE_PARTIES.find((phrase) => holds(words, phrase));
    return hit === undefined ? null : hit.join(SPACE);
};

const hasLetter = function hasLetter(word: string): boolean {
    return word.toLowerCase() !== word.toUpperCase();
};

const stemOf = function stemOf(word: string): string {
    const plural = word.length >= STEM_MIN_LENGTH && word.endsWith(PLURAL_MARK) && !word.endsWith(DOUBLE_PLURAL);
    return plural ? word.slice(0, -PLURAL_MARK.length) : word;
};

export const contentWordsOf = function contentWordsOf(text: string): ReadonlySet<string> {
    return new Set(
        sentenceWordsOf(withoutTags(text))
            .filter((word) => hasLetter(word) && !FUNCTION_WORDS.has(word))
            .map(stemOf),
    );
};

export const overlapOf = function overlapOf(left: ReadonlySet<string>, right: ReadonlySet<string>): number {
    const smaller = Math.min(left.size, right.size);
    if (smaller < RESTATEMENT_MIN_WORDS) {
        return 0;
    }
    return [...left].filter((word) => right.has(word)).length / smaller;
};

export const restates = function restates(left: string, right: string, threshold = SENTENCE_OVERLAP): boolean {
    return overlapOf(contentWordsOf(left), contentWordsOf(right)) >= threshold;
};

export const fieldRestates = function fieldRestates(left: string, right: string): boolean {
    return restates(left, right, FIELD_OVERLAP);
};

export const withoutQuotes = function withoutQuotes(text: string): string {
    const open = text.indexOf(QUOTE_OPEN);
    const close = open === -1 ? -1 : text.indexOf(QUOTE_CLOSE, open);
    if (open === -1 || close === -1) {
        return text;
    }
    return text.slice(0, open) + SPACE + withoutQuotes(text.slice(close + QUOTE_CLOSE.length));
};

const findingsAt = function findingsAt(sentences: readonly string[], at: number): CompositionFinding[] {
    const sentence = sentences[at] ?? "";
    const words = sentenceWordsOf(withoutTags(sentence));
    const found: CompositionFinding[] = [];
    const opener = at === 0 ? null : commentOpenerOf(words);
    if (opener !== null) {
        found.push({ evidence: opener, kind: "comment", sentence });
    }
    const unquoted = sentenceWordsOf(withoutTags(withoutQuotes(sentence)));
    const filler = fillerOf(unquoted);
    if (filler !== null) {
        found.push({ evidence: filler, kind: "filler", sentence });
    }
    const party = partyOf(unquoted);
    if (party !== null) {
        found.push({ evidence: party, kind: "party", sentence });
    }
    const earlier = sentences.slice(0, at).find((previous) => restates(previous, sentence));
    if (earlier !== undefined) {
        found.push({ evidence: earlier, kind: "restatement", sentence });
    }
    return found;
};

export const compositionFindingsOf = function compositionFindingsOf(text: string): CompositionFinding[] {
    const sentences = sentencesOf(text);
    return sentences.flatMap((_, at) => findingsAt(sentences, at));
};
