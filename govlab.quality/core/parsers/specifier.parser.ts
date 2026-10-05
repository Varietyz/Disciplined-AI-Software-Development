import { QUOTES, SPECIFIER_KEYWORDS } from "#configuration/constants/specifier.constants";
import { isWhitespace } from "@govlab/constants";
import { isWordBoundary } from "#core/matchers/word.matcher";

const quotedAfter = function quotedAfter(text: string, at: number): string | null {
    let i = at;
    while (i < text.length && (isWhitespace(text.charAt(i)) || text.charAt(i) === "(")) {
        i += 1;
    }
    const quote = text.charAt(i);
    if (!QUOTES.has(quote)) {
        return null;
    }
    const close = text.indexOf(quote, i + 1);
    return close === -1 ? null : text.slice(i + 1, close);
};

export const specifiersIn = function specifiersIn(text: string): string[] {
    const found: string[] = [];
    for (const keyword of SPECIFIER_KEYWORDS) {
        let at = text.indexOf(keyword);
        while (at !== -1) {
            const before = at === 0 ? "" : text.charAt(at - 1);
            const quoted = isWordBoundary(before) ? quotedAfter(text, at + keyword.length) : null;
            if (quoted !== null && quoted.length > 0) {
                found.push(quoted);
            }
            at = text.indexOf(keyword, at + 1);
        }
    }
    return found;
};
