import { ES_PLURAL_SUFFIXES, STOP_WORDS, SYNONYMS, S_KEEP_SUFFIXES } from "#configuration/constants/word.constants";
import { everyChar, isDigit } from "@govlab/constants";
import { labelOfRule, tokenizeWords } from "#core/parsers/word.parser";
import type { CatalogRule } from "#types/catalog.types";
import { stringField } from "#core/selectors/record.selector";

const STEM_MIN = 4;
const MAX_CODE_PREFIX = 4;
const MIN_WORD_LEN = 3;
const DESC_CAP = 6;
const MIN_SIG = 2;
const FALLBACK_SLICE = 50;
const IES_DROP = 3;
const ES_DROP = 2;
const FALLBACK_PREFIX = "x:";

export const labelOf = function labelOf(rule: CatalogRule): string {
    return labelOfRule(stringField(rule, "name") || rule.ruleId);
};

const stem = function stem(word: string): string {
    if (word.length <= STEM_MIN) {
        return word;
    }
    if (word.endsWith("ies")) {
        return `${word.slice(0, -IES_DROP)}y`;
    }
    if (ES_PLURAL_SUFFIXES.some((suffix) => word.endsWith(suffix))) {
        return word.slice(0, -ES_DROP);
    }
    const simplePlural = word.endsWith("s") && !S_KEEP_SUFFIXES.some((suffix) => word.endsWith(suffix));
    return simplePlural ? word.slice(0, -1) : word;
};

const isCode = function isCode(token: string): boolean {
    let i = 0;
    while (i < token.length && !isDigit(token[i] ?? "")) {
        i += 1;
    }
    return i < token.length && i <= MAX_CODE_PREFIX && everyChar(token.slice(i), isDigit);
};

const normalizeToken = function normalizeToken(token: string): string | null {
    if (token.length < MIN_WORD_LEN || isCode(token) || STOP_WORDS.has(token)) {
        return null;
    }
    const synonym = SYNONYMS.get(token) ?? token;
    const word = stem(SYNONYMS.get(synonym) ?? synonym);
    return STOP_WORDS.has(word) || word.length < MIN_WORD_LEN ? null : word;
};

const meaningful = function meaningful(text: string, cap?: number): string[] {
    const sig: string[] = [];
    for (const token of tokenizeWords(text)) {
        const word = normalizeToken(token);
        if (word !== null && !sig.includes(word)) {
            sig.push(word);
            if (typeof cap === "number" && sig.length >= cap) {
                break;
            }
        }
    }
    return sig;
};

export const concernOf = function concernOf(rule: CatalogRule): string {
    const fromLabel = meaningful(labelOf(rule));
    const fromDescription = fromLabel.length < MIN_SIG ? meaningful(stringField(rule, "description"), DESC_CAP) : [];
    const sig = (fromDescription.length > fromLabel.length ? fromDescription : fromLabel).toSorted((a, b) =>
        a.localeCompare(b),
    );
    if (sig.length === 0) {
        return `${FALLBACK_PREFIX}${tokenizeWords(labelOf(rule)).join("-").slice(0, FALLBACK_SLICE) || rule.ruleId}`;
    }
    return sig.join("-");
};
