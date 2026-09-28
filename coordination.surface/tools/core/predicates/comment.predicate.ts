const ATTRIBUTION_MARKERS = [
    "SPDX-License-Identifier",
    "Copyright",
    "copyright",
    "CC BY-SA",
    "Bane's Lab",
    "License:",
    "MIT License",
    "BSD License",
    "All rights reserved",
] as const;

const ESCAPE = "\\";

export const at = function at(text: string, index: number): string {
    return text[index] ?? "";
};

export const isAttribution = function isAttribution(text: string): boolean {
    return ATTRIBUTION_MARKERS.some((marker) => text.includes(marker));
};

export const endOfQuoted = function endOfQuoted(source: string, start: number, quote: string): number {
    let cursor = start;
    while (cursor < source.length) {
        const char = at(source, cursor);
        if (char === quote) {
            return cursor + 1;
        }
        cursor += char === ESCAPE ? 2 : 1;
    }
    return cursor;
};
