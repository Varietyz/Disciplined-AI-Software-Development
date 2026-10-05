import { isDigit } from "#core/predicates/character.predicate";

export const identifierParts = function identifierParts(token: string): readonly string[] {
    const parts: string[] = [];
    let current = "";
    let previousLower = false;
    for (const character of token) {
        const upper = character !== character.toLowerCase();
        if (upper && previousLower && current.length > 0) {
            parts.push(current);
            current = "";
        }
        current += character;
        previousLower = !upper && character === character.toLowerCase() && !isDigit(character);
    }
    return current.length > 0 ? [...parts, current] : parts;
};
