const ESCAPE = "~";

const HEX = "0123456789abcdef";

const RADIX = 16;

const isSafe = function isSafe(character: string): boolean {
    if (character >= "a" && character <= "z") {
        return true;
    }
    if (character >= "A" && character <= "Z") {
        return true;
    }
    if (character >= "0" && character <= "9") {
        return true;
    }
    return character === "-";
};

const hexOf = function hexOf(code: number): string {
    let out = "";
    let left = code;

    while (left > 0) {
        out = `${HEX.charAt(left % RADIX)}${out}`;
        left = Math.floor(left / RADIX);
    }

    return out.length === 0 ? "0" : out;
};

const hexValue = function hexValue(digits: string): number {
    let out = 0;

    for (const digit of digits) {
        const at = HEX.indexOf(digit);
        if (at === -1) {
            return -1;
        }
        out = out * RADIX + at;
    }

    return out;
};

export const encodeScope = function encodeScope(scope: string): string {
    let out = "";

    for (const character of scope) {
        if (isSafe(character) && character !== ESCAPE) {
            out += character;
            continue;
        }

        const code = character.codePointAt(0) ?? 0;
        const digits = hexOf(code);
        out += `${ESCAPE}${hexOf(digits.length)}${digits}`;
    }

    return out;
};

export const decodeScope = function decodeScope(encoded: string): string | null {
    let out = "";
    let index = 0;

    while (index < encoded.length) {
        const character = encoded.charAt(index);

        if (character !== ESCAPE) {
            if (!isSafe(character)) {
                return null;
            }
            out += character;
            index += 1;
            continue;
        }

        const width = hexValue(encoded.charAt(index + 1));
        if (width <= 0 || index + 2 + width > encoded.length) {
            return null;
        }

        const code = hexValue(encoded.slice(index + 2, index + 2 + width));
        if (code < 0) {
            return null;
        }

        out += String.fromCodePoint(code);
        index += 2 + width;
    }

    return out;
};
