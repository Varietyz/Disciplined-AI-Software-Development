import { isAlpha, isDigit } from "@govlab/constants";
import { isAsciiAlnum } from "#core/predicates/character.predicate";

const FORBIDDEN_LABEL_CHARS: ReadonlySet<string> = new Set(["(", ")", "[", "]", "{", "}", "<", ">", "&", '"', "|"]);
const SEGMENT_BREAKS: ReadonlySet<string> = new Set(["/", ".", "#", ":"]);
const MAX_ASCII = 126;
const HASH_SEED = 5381;
const HASH_MULTIPLIER = 33;
const HASH_MODULUS = 2_147_483_648;
const HASH_RADIX = 16;
const HASH_ID_WIDTH = 6;
const FALLBACK_ID = "n";
const ID_PAD = "0";
const ID_FILL = "_";

const isIdStart = function isIdStart(char: string): boolean {
    return isAlpha(char) || char === ID_FILL;
};

const collapseWhitespace = function collapseWhitespace(text: string): string {
    let out = "";
    let pendingSpace = false;
    for (const char of text) {
        if (char === " " || char === "\t") {
            pendingSpace = out.length > 0;
            continue;
        }
        out += pendingSpace ? ` ${char}` : char;
        pendingSpace = false;
    }
    return out;
};

const labelChar = function labelChar(char: string): string {
    if ((char.codePointAt(0) ?? 0) > MAX_ASCII) {
        return " ";
    }
    if (char === ";") {
        return ",";
    }
    return FORBIDDEN_LABEL_CHARS.has(char) ? " " : char;
};

export const label = function label(text: string): string {
    let out = "";
    for (const char of text) {
        out += labelChar(char);
    }
    return collapseWhitespace(out);
};

export const idSanitize = function idSanitize(id: string): string {
    let out = "";
    for (const char of id) {
        out += isAsciiAlnum(char) ? char : ID_FILL;
    }
    if (out.length === 0) {
        return FALLBACK_ID;
    }
    return isIdStart(out.charAt(0)) ? out : `${FALLBACK_ID}${ID_FILL}${out}`;
};

const hash6 = function hash6(text: string): string {
    let hash = HASH_SEED;
    for (let at = 0; at < text.length; at += 1) {
        hash = (hash * HASH_MULTIPLIER + (text.codePointAt(at) ?? 0)) % HASH_MODULUS;
    }
    return hash.toString(HASH_RADIX).padStart(HASH_ID_WIDTH, ID_PAD).slice(0, HASH_ID_WIDTH);
};

const lastSegment = function lastSegment(fqName: string): string {
    let cut = 0;
    for (let at = 0; at < fqName.length; at += 1) {
        if (SEGMENT_BREAKS.has(fqName.charAt(at))) {
            cut = at + 1;
        }
    }
    return fqName.slice(cut);
};

const alnumOnly = function alnumOnly(text: string): string {
    let out = "";
    for (const char of text) {
        if (isAsciiAlnum(char)) {
            out += char;
        }
    }
    return out;
};

export const nodeId = function nodeId(fqName: string): string {
    const head = alnumOnly(lastSegment(fqName)) || FALLBACK_ID;
    const start = isDigit(head.charAt(0)) ? `${FALLBACK_ID}${head}` : head;
    return `${start}${ID_FILL}${hash6(fqName)}`;
};
