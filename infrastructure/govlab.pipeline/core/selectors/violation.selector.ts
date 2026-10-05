import { COUNT_KEYWORDS, DIGITS } from "#configuration/constants/violation.constants";

const countBefore = function countBefore(lower: string, at: number): number | null {
    let cursor = at - 1;
    while (cursor >= 0 && lower.charAt(cursor) === " ") {
        cursor -= 1;
    }
    const end = cursor;
    while (cursor >= 0 && DIGITS.has(lower.charAt(cursor))) {
        cursor -= 1;
    }
    if (end <= cursor) {
        return null;
    }
    const value = Number(lower.slice(cursor + 1, end + 1));
    return Number.isNaN(value) ? null : value;
};

const lastCountOf = function lastCountOf(lower: string, keyword: string): number | null {
    let result: number | null = null;
    let from = lower.indexOf(keyword);
    while (from !== -1) {
        result = countBefore(lower, from) ?? result;
        from = lower.indexOf(keyword, from + keyword.length);
    }
    return result;
};

export const lastCount = function lastCount(text: string): number | null {
    const lower = text.toLowerCase();
    for (const keyword of COUNT_KEYWORDS) {
        const result = lastCountOf(lower, keyword);
        if (result !== null) {
            return result;
        }
    }
    return null;
};
