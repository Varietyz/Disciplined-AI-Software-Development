import {
    AGENT_MARKER,
    COORDINATORS,
    IRREGULAR_PARTICIPLES,
    NOT_PARTICIPLES,
    PARTICIPLE_MIN_LENGTH,
    PARTICIPLE_SUFFIX,
    PASSIVE_ADVERBS,
    PASSIVE_ADVERB_SUFFIX,
    PASSIVE_AUXILIARIES,
    SENTENCE_TERMINALS,
    SENTENCE_WORD_STOPS,
} from "../manifests/sentence.manifest.ts";
import type { SentenceShape } from "../../types/writing.types.ts";

export const sentencesOf = function sentencesOf(text: string): string[] {
    const sentences: string[] = [];
    let current = "";
    for (const char of text) {
        current += char;
        if (SENTENCE_TERMINALS.has(char)) {
            if (current.trim().length > 0) {
                sentences.push(current.trim());
            }
            current = "";
        }
    }
    if (current.trim().length > 0) {
        sentences.push(current.trim());
    }
    return sentences;
};

export const sentenceWordsOf = function sentenceWordsOf(sentence: string): string[] {
    const words: string[] = [];
    let current = "";
    for (const char of sentence) {
        if (SENTENCE_WORD_STOPS.has(char)) {
            if (current.length > 0) {
                words.push(current.toLowerCase());
            }
            current = "";
        } else {
            current += char;
        }
    }
    if (current.length > 0) {
        words.push(current.toLowerCase());
    }
    return words;
};

export const isParticiple = function isParticiple(word: string): boolean {
    if (IRREGULAR_PARTICIPLES.has(word)) {
        return true;
    }
    if (NOT_PARTICIPLES.has(word) || word.length < PARTICIPLE_MIN_LENGTH) {
        return false;
    }
    return word.endsWith(PARTICIPLE_SUFFIX) && !word.endsWith(`e${PARTICIPLE_SUFFIX}`);
};

const isAdverb = function isAdverb(word: string): boolean {
    return PASSIVE_ADVERBS.has(word) || word.endsWith(PASSIVE_ADVERB_SUFFIX);
};

const participleAfter = function participleAfter(words: readonly string[], auxiliary: number): number {
    const next = words[auxiliary + 1] ?? "";
    if (isParticiple(next)) {
        return auxiliary + 1;
    }
    const after = words[auxiliary + 2] ?? "";
    return isAdverb(next) && isParticiple(after) ? auxiliary + 2 : -1;
};

export const isAgentlessPassive = function isAgentlessPassive(words: readonly string[]): boolean {
    for (let index = 0; index < words.length; index += 1) {
        if (!PASSIVE_AUXILIARIES.has(words[index] ?? "")) {
            continue;
        }
        const participle = participleAfter(words, index);
        if (participle !== -1) {
            return !words.slice(participle + 1).includes(AGENT_MARKER);
        }
    }
    return false;
};

export const joinsOf = function joinsOf(words: readonly string[]): number {
    return words.filter((word) => COORDINATORS.has(word)).length;
};

export const shapeOf = function shapeOf(sentence: string): SentenceShape {
    const words = sentenceWordsOf(sentence);
    return { agentlessPassive: isAgentlessPassive(words), joins: joinsOf(words), words: words.length };
};

export const shapesOf = function shapesOf(text: string): SentenceShape[] {
    return sentencesOf(text).map(shapeOf);
};

export const longestOf = function longestOf(shapes: readonly SentenceShape[]): number {
    return shapes.reduce((longest, shape) => Math.max(longest, shape.words), 0);
};
