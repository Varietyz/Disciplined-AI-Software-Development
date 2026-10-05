import { BASE64_URL_MARKS, DASH } from "#configuration/constants/detector.constants";
import { isAlpha, isDigit, isUpperAlpha } from "@govlab/constants";
import type { TokenAlphabet } from "#types/detector.types";

const isAlphanumeric = function isAlphanumeric(character: string): boolean {
    return isAlpha(character) || isDigit(character);
};

const ALPHABETS: Readonly<Record<TokenAlphabet, (character: string) => boolean>> = {
    alnum: isAlphanumeric,
    alnumDash: (character) => isAlphanumeric(character) || character === DASH,
    upperDigit: (character) => isUpperAlpha(character) || isDigit(character),
};

const everyCharacter = function everyCharacter(text: string, test: (character: string) => boolean): boolean {
    for (const character of text) {
        if (!test(character)) {
            return false;
        }
    }
    return true;
};

export const isInAlphabet = function isInAlphabet(text: string, alphabet: TokenAlphabet): boolean {
    return everyCharacter(text, ALPHABETS[alphabet]);
};

export const isBase64Url = function isBase64Url(text: string): boolean {
    return everyCharacter(text, (character) => isAlphanumeric(character) || BASE64_URL_MARKS.has(character));
};
