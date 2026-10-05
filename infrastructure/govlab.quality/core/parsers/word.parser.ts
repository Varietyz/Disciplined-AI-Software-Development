import { isAlpha, isDigit, isLowerAlpha, isUpperAlpha } from "@govlab/constants";

const SEP = " ";
const QUALIFIED_MARKER = "puppycrawl";

const isAlnum = function isAlnum(ch: string): boolean {
    return isAlpha(ch) || isDigit(ch);
};

const isBoundary = function isBoundary(prev: string, ch: string): boolean {
    if (prev === "") {
        return false;
    }
    return (isLowerAlpha(prev) && isUpperAlpha(ch)) || isDigit(prev) !== isDigit(ch);
};

export const tokenizeWords = function tokenizeWords(value: string): string[] {
    let marked = "";
    let prev = "";
    for (const ch of value) {
        if (!isAlnum(ch)) {
            marked += SEP;
            prev = "";
            continue;
        }
        marked += isBoundary(prev, ch) ? SEP + ch : ch;
        prev = ch;
    }
    return marked
        .split(SEP)
        .filter(Boolean)
        .map((word) => word.toLowerCase());
};

export const labelOfRule = function labelOfRule(name: string): string {
    if (name.includes(".") && name.includes(QUALIFIED_MARKER)) {
        return name.slice(name.lastIndexOf(".") + 1).trim();
    }
    return name.trim();
};
