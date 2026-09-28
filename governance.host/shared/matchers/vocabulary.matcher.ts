const TERM_STOPS: ReadonlySet<string> = new Set([
    " ",
    "\n",
    "\t",
    ",",
    ".",
    ";",
    ":",
    "!",
    "?",
    "(",
    ")",
    '"',
    "'",
    "—",
    "-",
    "*",
    "`",
    "/",
]);

const isBoundary = function isBoundary(char: string): boolean {
    return char.length === 0 || TERM_STOPS.has(char);
};

const occursAsWord = function occursAsWord(lower: string, term: string): boolean {
    let from = lower.indexOf(term);
    while (from !== -1) {
        const before = from === 0 ? "" : lower.charAt(from - 1);
        const after = lower.charAt(from + term.length);
        if (isBoundary(before) && isBoundary(after)) {
            return true;
        }
        from = lower.indexOf(term, from + term.length);
    }
    return false;
};

export const firstTermIn = function firstTermIn(text: string, terms: readonly string[]): string | null {
    const lower = text.toLowerCase();
    return terms.find((term) => occursAsWord(lower, term)) ?? null;
};

const wordAt = function wordAt(lower: string, at: number, term: string): boolean {
    const before = at === 0 ? "" : lower.charAt(at - 1);
    return lower.startsWith(term, at) && isBoundary(before) && isBoundary(lower.charAt(at + term.length));
};

const DIGITS = "0123456789";
const SPACE = " ";

const digitsFrom = function digitsFrom(text: string, at: number): number {
    let end = at;
    while (end < text.length && DIGITS.includes(text.charAt(end))) {
        end += 1;
    }
    return end;
};

export const numberedPhraseIn = function numberedPhraseIn(text: string, nouns: readonly string[]): string | null {
    const lower = text.toLowerCase();
    for (let at = 0; at < lower.length; at += 1) {
        const noun = nouns.find((candidate) => wordAt(lower, at, candidate));
        const start = noun === undefined ? -1 : at + noun.length + SPACE.length;
        if (noun !== undefined && lower.charAt(at + noun.length) === SPACE) {
            const end = digitsFrom(lower, start);
            if (end > start && isBoundary(lower.charAt(end))) {
                return text.slice(at, end);
            }
        }
    }
    return null;
};

const casedLike = function casedLike(original: string, replacement: string): string {
    const first = original.charAt(0);
    const capital = first !== first.toLowerCase();
    return capital ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
};

const knownAt = function knownAt(
    lower: string,
    at: number,
    terms: readonly string[],
    names: readonly string[],
): string | undefined {
    return names.some((name) => wordAt(lower, at, name)) ? undefined : terms.find((term) => wordAt(lower, at, term));
};

export const firstKnownIn = function firstKnownIn(
    text: string,
    terms: readonly string[],
    names: readonly string[] = [],
): string | null {
    const lower = text.toLowerCase();
    const longest = terms.toSorted((left, right) => right.length - left.length);
    for (let at = 0; at < lower.length; at += 1) {
        const term = knownAt(lower, at, longest, names);
        if (term !== undefined) {
            return term;
        }
    }
    return null;
};

export const replaceKnown = function replaceKnown(
    text: string,
    known: ReadonlyMap<string, string>,
    names: readonly string[] = [],
): string {
    const lower = text.toLowerCase();
    const terms = [...known.keys()].toSorted((left, right) => right.length - left.length);
    let output = "";
    let at = 0;
    while (at < text.length) {
        const term = knownAt(lower, at, terms, names);
        if (term === undefined) {
            output += text.charAt(at);
            at += 1;
            continue;
        }
        output += casedLike(text.slice(at, at + term.length), known.get(term) ?? term);
        at += term.length;
    }
    return output;
};
