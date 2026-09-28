export const isWordCharacter = function isWordCharacter(character: string): boolean {
    if (character.length === 0) {
        return false;
    }

    const isUpper = character >= "A" && character <= "Z";
    const isLower = character >= "a" && character <= "z";
    const isDigit = character >= "0" && character <= "9";

    return isUpper || isLower || isDigit || character === "_";
};

export const accumulate = function accumulate(text: string, isPart: (char: string) => boolean): string[] {
    const out: string[] = [];
    let held = "";

    for (const char of text) {
        if (isPart(char)) {
            held += char;
            continue;
        }
        if (held.length > 0) {
            out.push(held);
        }
        held = "";
    }

    if (held.length > 0) {
        out.push(held);
    }
    return out;
};
