import { findStaleEsTokens } from "#core/matchers/target.matcher";

export const bumpEsTokens = function bumpEsTokens(
    text: string,
    minYear: number,
    replacement: string,
): { text: string; changed: boolean } {
    const stale = findStaleEsTokens(text, minYear);
    const next = stale.reduceRight(
        (acc, span) => acc.slice(0, span.open + 1) + replacement + acc.slice(span.close),
        text,
    );
    return { changed: stale.length > 0, text: next };
};
