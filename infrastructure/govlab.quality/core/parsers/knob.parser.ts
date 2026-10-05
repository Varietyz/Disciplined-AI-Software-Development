import { everyChar, isDigit, isIdentifierChar } from "@govlab/constants";

const SCAN_STOPS: ReadonlySet<string> = new Set(["\n", ";", ")"]);
const RUBY_TAG = "!ruby/";

export const intAt = function intAt(text: string, start: number): number | null {
    let i = start;
    while (i < text.length && !isDigit(text[i] ?? "")) {
        if (SCAN_STOPS.has(text[i] ?? "")) {
            return null;
        }
        i += 1;
    }
    let digits = "";
    while (i < text.length && isDigit(text[i] ?? "")) {
        digits += text[i];
        i += 1;
    }
    return digits === "" ? null : Number(digits);
};

export const intAfter = function intAfter(
    text: string,
    marker: string,
    opts: { from: number; window?: number },
): number | null {
    const at = text.indexOf(marker, opts.from);
    if (at === -1 || (typeof opts.window === "number" && at - opts.from > opts.window)) {
        return null;
    }
    return intAt(text, at + marker.length);
};

export const withoutRubyTags = function withoutRubyTags(text: string): string {
    let result = "";
    let i = 0;
    while (i < text.length) {
        if (text.startsWith(RUBY_TAG, i)) {
            while (i < text.length && text[i] !== " " && text[i] !== "\n") {
                i += 1;
            }
        } else {
            result += text[i];
            i += 1;
        }
    }
    return result;
};

export const isDigitsOnly = function isDigitsOnly(raw: string): boolean {
    return raw.length > 0 && everyChar(raw, isDigit);
};

export const trailingIdentifier = function trailingIdentifier(chunk: string): string {
    let field = "";
    for (const ch of chunk) {
        field = isIdentifierChar(ch) ? field + ch : "";
    }
    return field;
};
