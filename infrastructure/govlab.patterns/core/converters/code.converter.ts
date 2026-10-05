import { fingerprintOf } from "@govlab/content-fingerprint";

const WHITESPACE: ReadonlySet<string> = new Set([" ", "\t", "\n", "\r"]);
const GAP = " ";

const normalize = function normalize(text: string): string {
    let out = "";
    let gap = false;
    for (const char of text) {
        if (WHITESPACE.has(char)) {
            gap = true;
        } else {
            out += gap && out.length > 0 ? `${GAP}${char}` : char;
            gap = false;
        }
    }
    return out;
};

export const bodyHash = function bodyHash(text: string): string {
    return fingerprintOf([normalize(text)]);
};
