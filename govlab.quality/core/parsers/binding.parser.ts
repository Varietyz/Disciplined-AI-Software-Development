const CANONICAL_KEY = "canonical:";
const LIST_OPEN = "[";
const LIST_CLOSE = "]";
const ITEM_SEPARATOR = ",";
const QUOTES = new Set(['"', "'"]);

const unquote = function unquote(item: string): string {
    const trimmed = item.trim();
    return trimmed.length >= 2 && QUOTES.has(trimmed.charAt(0)) ? trimmed.slice(1, -1) : trimmed;
};

export const canonicalOf = function canonicalOf(text: string): string[] | null {
    const key = text.indexOf(CANONICAL_KEY);
    if (key === -1) {
        return null;
    }
    const open = text.indexOf(LIST_OPEN, key);
    const close = open === -1 ? -1 : text.indexOf(LIST_CLOSE, open);
    if (close === -1) {
        return null;
    }
    return text
        .slice(open + 1, close)
        .split(ITEM_SEPARATOR)
        .map(unquote)
        .filter((item) => item.length > 0);
};
