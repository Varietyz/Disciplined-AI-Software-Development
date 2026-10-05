const HYPHEN = "-";

const isUpper = function isUpper(letter: string): boolean {
    return letter !== letter.toLowerCase();
};

export const propertyOf = function propertyOf(key: string): string {
    let property = "";
    for (let index = 0; index < key.length; index += 1) {
        const letter = key.charAt(index);
        property += isUpper(letter) ? HYPHEN + letter.toLowerCase() : letter;
    }
    return property;
};
