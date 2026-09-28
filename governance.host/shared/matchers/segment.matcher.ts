import type { LetterCase, Splitter } from "../../types/taxonomy.types.ts";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SLOT_JOINER = "-";

const isLower = function isLower(char: string): boolean {
    return char.length === 1 && LOWER.includes(char);
};

const isUpper = function isUpper(char: string): boolean {
    return char.length === 1 && UPPER.includes(char);
};

const isDigit = function isDigit(char: string): boolean {
    return char.length === 1 && DIGITS.includes(char);
};

const isLowerOrDigit = function isLowerOrDigit(char: string): boolean {
    return isLower(char) || isDigit(char);
};

const fitsLetters = function fitsLetters(word: string, letters: LetterCase): boolean {
    const isLetter = letters === "upper" ? isUpper : isLower;
    return word !== "" && Array.from(word, (char) => isLetter(char) || isDigit(char)).every(Boolean);
};

const joinedWords = function joinedWords(stem: string, joiner: string, letters: LetterCase): readonly string[] | null {
    const words = stem.split(joiner);
    return words.every((word) => fitsLetters(word, letters)) ? words.map((word) => word.toLowerCase()) : null;
};

const humpedWords = function humpedWords(stem: string, leadsUpper: boolean): readonly string[] | null {
    const first = stem.charAt(0);
    if (stem === "" || isUpper(first) !== leadsUpper || !(isUpper(first) || isLower(first))) {
        return null;
    }
    const words: string[] = [];
    let current = "";
    for (const char of stem) {
        if (isUpper(char)) {
            if (current !== "") {
                words.push(current);
            }
            current = char.toLowerCase();
        } else if (isLowerOrDigit(char)) {
            current += char;
        } else {
            return null;
        }
    }
    words.push(current);
    return words;
};

export const isWellFormedJoiner = function isWellFormedJoiner(joiner: string): boolean {
    return joiner !== "" && ![...joiner].some((char) => isLower(char) || isUpper(char) || isDigit(char));
};

export const wordsOf = function wordsOf(stem: string, splitter: Splitter): readonly string[] | null {
    return splitter.joiner === null
        ? humpedWords(stem, splitter.letters === "upper")
        : joinedWords(stem, splitter.joiner, splitter.letters);
};

export const slotWordOf = function slotWordOf(words: readonly string[]): string {
    return words.join(SLOT_JOINER);
};
