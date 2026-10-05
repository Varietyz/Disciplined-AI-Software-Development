import {
    AMERICAN_WORDS,
    IZE_STEMS,
    IZE_SUFFIXES,
    PLURAL_IES,
    PLURAL_KEPT_AFTER,
    PLURAL_MINIMUM_LENGTH,
    PLURAL_SUFFIX,
    SPELLING_PREFIXES,
} from "#configuration/constants/word.constants";

const STEMS: ReadonlySet<string> = new Set(IZE_STEMS);

const SUFFIXES: readonly (readonly [string, string])[] = Object.entries(IZE_SUFFIXES).toSorted(
    ([left], [right]) => right.length - left.length,
);

const isPrefixedStem = function isPrefixedStem(stem: string): boolean {
    return (
        STEMS.has(stem) ||
        SPELLING_PREFIXES.some((prefix) => stem.startsWith(prefix) && STEMS.has(stem.slice(prefix.length)))
    );
};

const listedOf = function listedOf(word: string): string | null {
    if (Object.hasOwn(AMERICAN_WORDS, word)) {
        return AMERICAN_WORDS[word] ?? null;
    }
    const prefix = SPELLING_PREFIXES.find(
        (candidate) => word.startsWith(candidate) && Object.hasOwn(AMERICAN_WORDS, word.slice(candidate.length)),
    );
    return prefix === undefined ? null : prefix + (AMERICAN_WORDS[word.slice(prefix.length)] ?? "");
};

export const americanOf = function americanOf(word: string): string {
    const listed = listedOf(word);
    if (listed !== null) {
        return listed;
    }
    for (const [british, american] of SUFFIXES) {
        const stem = word.slice(0, -british.length);
        if (word.endsWith(british) && isPrefixedStem(stem)) {
            return stem + american;
        }
    }
    return word;
};

const singularOf = function singularOf(word: string): string {
    if (word.length < PLURAL_MINIMUM_LENGTH || !word.endsWith(PLURAL_SUFFIX)) {
        return word;
    }
    const [ies, y] = PLURAL_IES;
    if (word.endsWith(ies)) {
        return word.slice(0, -ies.length) + y;
    }
    const before = word.charAt(word.length - PLURAL_SUFFIX.length - 1);
    return PLURAL_KEPT_AFTER.has(before) ? word : word.slice(0, -PLURAL_SUFFIX.length);
};

export const normalizeWord = function normalizeWord(word: string): string {
    const spelled = americanOf(word.toLowerCase());
    return americanOf(singularOf(spelled));
};
