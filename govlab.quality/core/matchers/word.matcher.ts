import { isIdentifierChar } from "@govlab/constants";

const isIdentChar = function isIdentChar(ch: string): boolean {
    return isIdentifierChar(ch) || ch === "$";
};

export const isWordBoundary = function isWordBoundary(ch: string): boolean {
    return !isIdentChar(ch);
};

export const wordIncludes = function wordIncludes(text: string, name: string): boolean {
    let idx = text.indexOf(name);
    while (idx !== -1) {
        const before = idx === 0 ? "" : text.charAt(idx - 1);
        const afterAt = idx + name.length;
        const after = afterAt >= text.length ? "" : text.charAt(afterAt);
        if (isWordBoundary(before) && isWordBoundary(after)) {
            return true;
        }
        idx = text.indexOf(name, idx + 1);
    }
    return false;
};
