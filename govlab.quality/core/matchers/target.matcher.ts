import {
    ES_LEGACY_BASE,
    ES_LEGACY_MAX,
    ES_MODERN_BASE,
    ES_NEXT,
    ES_PREFIX_LEN,
    MIN_TOKEN_LEN,
    YEAR_THRESHOLD,
} from "#configuration/constants/target.constants";
import { everyChar, isDigit } from "@govlab/constants";
import type { EsTokenSpan } from "#types/target.types";

const isEsPrefix = function isEsPrefix(token: string): boolean {
    return token.slice(0, ES_PREFIX_LEN).toUpperCase() === "ES";
};

const yearOfVersion = function yearOfVersion(n: number): number {
    if (n >= YEAR_THRESHOLD) {
        return n;
    }
    return n <= ES_LEGACY_MAX ? ES_LEGACY_BASE + n : ES_MODERN_BASE + n;
};

export const esTokenYear = function esTokenYear(token: string): number | null {
    if (token.length < MIN_TOKEN_LEN || !isEsPrefix(token)) {
        return null;
    }
    const rest = token.slice(ES_PREFIX_LEN);
    if (rest.toLowerCase() === ES_NEXT) {
        return Number.POSITIVE_INFINITY;
    }
    return rest.length > 0 && everyChar(rest, isDigit) ? yearOfVersion(Number(rest)) : null;
};

const spanAt = function spanAt(text: string, open: number): { end: number; span: EsTokenSpan | null } {
    const close = text.indexOf('"', open + 1);
    if (close === -1) {
        return { end: text.length, span: null };
    }
    const token = text.slice(open + 1, close);
    return { end: close, span: esTokenYear(token) === null ? null : { close, open, token } };
};

const findEsTokenSpans = function findEsTokenSpans(text: string): EsTokenSpan[] {
    const spans: EsTokenSpan[] = [];
    let at = text.indexOf('"');
    while (at !== -1) {
        const { end, span } = spanAt(text, at);
        if (span !== null) {
            spans.push(span);
        }
        at = text.indexOf('"', end + 1);
    }
    return spans;
};

export const findStaleEsTokens = function findStaleEsTokens(text: string, minYear: number): EsTokenSpan[] {
    return findEsTokenSpans(text).filter((span) => {
        const year = esTokenYear(span.token);
        return year !== null && year < minYear;
    });
};
