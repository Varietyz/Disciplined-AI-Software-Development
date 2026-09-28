import type { CanonCheckId, CompositionKind } from "../../types/writing.types.ts";

export const CHECK_BY_KIND: ReadonlyMap<CompositionKind, CanonCheckId> = new Map([
    ["comment", "no-comment-on-previous"],
    ["filler", "no-filler-phrase"],
    ["party", "named-party"],
    ["restatement", "no-restatement"],
]);

export const COMMENT_OPENERS: readonly (readonly string[])[] = [
    ["that", "is"],
    ["this", "is"],
    ["that", "was"],
    ["this", "was"],
    ["that", "means"],
    ["this", "means"],
    ["which", "is"],
    ["which", "means"],
    ["that", "makes"],
    ["this", "makes"],
    ["that", "gives"],
    ["this", "gives"],
    ["that", "comes"],
    ["this", "comes"],
    ["that", "matters"],
    ["this", "matters"],
    ["that", "difference"],
    ["this", "difference"],
];

export const LABELLING_OPENERS: readonly (readonly string[])[] = [
    ["that", "is"],
    ["this", "is"],
    ["that", "was"],
    ["this", "was"],
];

export const LABEL_MAX_WORDS = 3;

export const FILLER_PHRASES: readonly (readonly string[])[] = [
    ["it", "is", "worth", "noting"],
    ["worth", "noting"],
    ["note", "that"],
    ["notice", "that"],
    ["as", "you", "can", "see"],
    ["the", "key", "point"],
    ["the", "point", "is"],
    ["in", "other", "words"],
    ["put", "simply"],
    ["simply", "put"],
    ["to", "be", "clear"],
    ["needless", "to", "say"],
    ["it", "is", "important", "to"],
    ["keep", "in", "mind"],
    ["in", "summary"],
    ["in", "short"],
    ["to", "put", "it", "another", "way"],
    ["the", "idea", "is"],
    ["what", "this", "means"],
    ["this", "means", "that"],
];

export const INDEFINITE_PARTIES: readonly (readonly string[])[] = [
    ["someone"],
    ["somebody"],
    ["anyone"],
    ["anybody"],
    ["nobody"],
    ["no", "one"],
    ["everyone"],
    ["everybody"],
];

export const FUNCTION_WORDS: ReadonlySet<string> = new Set([
    "a",
    "about",
    "after",
    "all",
    "an",
    "and",
    "any",
    "are",
    "as",
    "at",
    "be",
    "because",
    "been",
    "before",
    "being",
    "both",
    "but",
    "by",
    "can",
    "cannot",
    "could",
    "do",
    "does",
    "each",
    "every",
    "for",
    "from",
    "has",
    "have",
    "how",
    "if",
    "in",
    "into",
    "is",
    "it",
    "its",
    "may",
    "more",
    "must",
    "never",
    "no",
    "not",
    "of",
    "on",
    "one",
    "only",
    "or",
    "other",
    "own",
    "same",
    "should",
    "so",
    "than",
    "that",
    "the",
    "their",
    "them",
    "then",
    "there",
    "these",
    "they",
    "this",
    "those",
    "through",
    "to",
    "under",
    "until",
    "was",
    "what",
    "when",
    "where",
    "whether",
    "which",
    "while",
    "who",
    "will",
    "with",
    "without",
    "would",
    "you",
    "your",
]);

export const PLURAL_MARK = "s";

export const STEM_MIN_LENGTH = 4;

export const RESTATEMENT_MIN_WORDS = 4;

export const SENTENCE_OVERLAP = 0.8;

export const FIELD_OVERLAP = 0.6;

export const QUOTE_OPEN = "<em>";

export const QUOTE_CLOSE = "</em>";
