import { BIAS_TOKENS } from "#configuration/constants/context.constants";

const BIAS = new Set<string>(BIAS_TOKENS);

const isAlnumChar = function isAlnumChar(ch: string): boolean {
    const c = ch.toLowerCase();
    return (c >= "a" && c <= "z") || (c >= "0" && c <= "9");
};

export const biasTokensIn = function biasTokensIn(text: string): string[] {
    const found: string[] = [];
    let word = "";
    for (const ch of `${text} `) {
        if (isAlnumChar(ch)) {
            word += ch.toLowerCase();
        } else {
            if (word.length > 0 && BIAS.has(word) && !found.includes(word)) {
                found.push(word);
            }
            word = "";
        }
    }
    return found;
};
