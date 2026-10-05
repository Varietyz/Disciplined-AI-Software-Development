import {
    DIGITS,
    IDENTIFIER_JOINER,
    LOWER_ALPHA,
    UPPER_ALPHA,
    WHITESPACE,
} from "@govlab/constants/configuration/constants/character.constants.ts";
import { describe, expect, it } from "vitest";
import {
    everyChar,
    isAlpha,
    isDigit,
    isIdentifierChar,
    isLowerAlpha,
    isUpperAlpha,
    isWhitespace,
} from "@govlab/constants/core/predicates/character.predicate.ts";

describe("isUpperAlpha", () => {
    it("accepts every declared upper-case letter", () => {
        for (const char of UPPER_ALPHA) {
            expect(isUpperAlpha(char)).toBe(true);
        }
    });

    it("rejects lower case, digits and the empty string", () => {
        for (const char of [...LOWER_ALPHA, ...DIGITS, "", "_", "-"]) {
            expect(isUpperAlpha(char)).toBe(false);
        }
    });
});

describe("isLowerAlpha", () => {
    it("accepts every declared lower-case letter", () => {
        for (const char of LOWER_ALPHA) {
            expect(isLowerAlpha(char)).toBe(true);
        }
    });

    it("rejects upper case, digits and the empty string", () => {
        for (const char of [...UPPER_ALPHA, ...DIGITS, "", "_", "-"]) {
            expect(isLowerAlpha(char)).toBe(false);
        }
    });
});

describe("isAlpha", () => {
    it("accepts letters of both cases", () => {
        for (const char of [...UPPER_ALPHA, ...LOWER_ALPHA]) {
            expect(isAlpha(char)).toBe(true);
        }
    });

    it("rejects digits, separators and the empty string", () => {
        for (const char of [...DIGITS, "", "_", "$", "-"]) {
            expect(isAlpha(char)).toBe(false);
        }
    });
});

describe("isDigit", () => {
    it("accepts every declared digit", () => {
        for (const char of DIGITS) {
            expect(isDigit(char)).toBe(true);
        }
    });

    it("rejects letters and the empty string", () => {
        for (const char of [...LOWER_ALPHA, ""]) {
            expect(isDigit(char)).toBe(false);
        }
    });
});

describe("isWhitespace", () => {
    it("accepts every declared whitespace character", () => {
        for (const char of WHITESPACE) {
            expect(isWhitespace(char)).toBe(true);
        }
    });

    it("rejects a visible character and the empty string", () => {
        expect(isWhitespace("a")).toBe(false);
        expect(isWhitespace("")).toBe(false);
    });
});

describe("isIdentifierChar", () => {
    it("accepts letters, digits and the joiner", () => {
        for (const char of [...UPPER_ALPHA, ...LOWER_ALPHA, ...DIGITS, IDENTIFIER_JOINER]) {
            expect(isIdentifierChar(char)).toBe(true);
        }
    });

    it("rejects separators and the empty string, which terminate an identifier scan", () => {
        for (const char of ["", "-", ".", "/", " ", "(", "$"]) {
            expect(isIdentifierChar(char)).toBe(false);
        }
    });

    it("rejects a multi-character string, so a prefix cannot pass as one character", () => {
        expect(isIdentifierChar("ab")).toBe(false);
    });
});

describe("everyChar", () => {
    it("holds when every code point passes, and for the empty string", () => {
        expect(everyChar("2026", isDigit)).toBe(true);
        expect(everyChar("", isDigit)).toBe(true);
    });

    it("fails on the first code point that does not pass, counting an astral character once", () => {
        expect(everyChar("20a6", isDigit)).toBe(false);
        const seen: string[] = [];
        everyChar("a😀", (char) => {
            seen.push(char);
            return true;
        });
        expect(seen).toStrictEqual(["a", "😀"]);
    });
});
