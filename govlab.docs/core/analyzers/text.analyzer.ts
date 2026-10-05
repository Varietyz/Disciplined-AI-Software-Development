import { isDigit } from "@govlab/constants";

const COUNT_DIGITS = 3;
const THOUSANDS_SEPARATOR = ",";

const isThousandsComma = function isThousandsComma(text: string, at: number): boolean {
    if (text.charAt(at) !== THOUSANDS_SEPARATOR || !isDigit(text.charAt(at - 1))) {
        return false;
    }
    for (let offset = 1; offset <= COUNT_DIGITS; offset += 1) {
        if (!isDigit(text.charAt(at + offset))) {
            return false;
        }
    }
    return true;
};

const countStart = function countStart(text: string, comma: number): number {
    let start = comma - 1;
    while (start > 0 && isDigit(text.charAt(start - 1))) {
        start -= 1;
    }
    return start;
};

export const hardcodedCounts = function hardcodedCounts(text: string): string[] {
    const hits = new Set<string>();
    for (let at = 1; at + COUNT_DIGITS < text.length; at += 1) {
        if (isThousandsComma(text, at)) {
            hits.add(text.slice(countStart(text, at), at + COUNT_DIGITS + 1));
        }
    }
    return [...hits];
};
