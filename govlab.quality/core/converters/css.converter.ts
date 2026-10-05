import { isAsciiDigit, isDot } from "#core/predicates/code-point.predicate";
import { BASE_FONT_PX } from "#configuration/constants/css.constants";

const numericPrefixEnd = function numericPrefixEnd(token: string, start: number): number {
    let i = start;
    let hasDot = false;
    while (i < token.length) {
        const code = token.codePointAt(i);
        if (isAsciiDigit(code)) {
            i += 1;
        } else if (isDot(code) && !hasDot) {
            hasDot = true;
            i += 1;
        } else {
            break;
        }
    }
    return i;
};

const leadingNumberString = function leadingNumberString(token: string): { next: number; numStr: string } {
    const start = token.startsWith("-") ? 1 : 0;
    const end = numericPrefixEnd(token, start);
    const numStr = (start === 1 ? "-" : "") + token.slice(start, end);
    return { next: end, numStr };
};

export const numericPx = function numericPx(token: string): number | null {
    const { numStr, next } = leadingNumberString(token);
    const value = numStr === "" || numStr === "-" ? Number.NaN : Number(numStr);
    if (!Number.isFinite(value)) {
        return null;
    }
    const rest = token.slice(next).trim();
    return rest.startsWith("rem") || rest.startsWith("em") ? value * BASE_FONT_PX : value;
};
