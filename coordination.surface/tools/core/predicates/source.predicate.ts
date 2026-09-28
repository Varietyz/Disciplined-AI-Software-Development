import { isWordCharacter } from "./token.predicate.ts";

const QUOTES = new Set(['"', "'", "`"]);

const ESCAPE = "\\";

const DECLARATION_TAILS = [":", "(", ",", " }", "\n"];

const FILESYSTEM_IMPORT_TAIL = `"node:fs";`;

export const filesystemImports = function filesystemImports(source: string): string[] {
    return source
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("import ") && line.endsWith(FILESYSTEM_IMPORT_TAIL));
};

type Mode = "block" | "code" | "line" | "quote";

interface Scan {
    readonly mode: Mode;
    readonly quote: string;
    readonly escaped: boolean;
}

interface Step {
    readonly next: Scan;
    readonly width: number;
    readonly code: boolean;
}

const CODE: Scan = { escaped: false, mode: "code", quote: "" };

const OPENERS = new Map<string, Mode>([
    ["//", "line"],
    ["/*", "block"],
]);

const BLOCK_CLOSE = "*/";

const skipped = function skipped(next: Scan, width: number): Step {
    return { code: false, next, width };
};

const commentStep = function commentStep(scan: Scan, pair: string): Step | null {
    if (scan.mode === "line") {
        return skipped(pair.startsWith("\n") ? CODE : scan, 1);
    }
    if (scan.mode === "block") {
        return pair === BLOCK_CLOSE ? skipped(CODE, 2) : skipped(scan, 1);
    }
    return null;
};

const quoteStep = function quoteStep(scan: Scan, char: string): Step | null {
    if (scan.escaped) {
        return skipped({ ...scan, escaped: false }, 1);
    }
    if (char === ESCAPE) {
        return skipped({ ...scan, escaped: true }, 1);
    }
    if (scan.mode === "quote") {
        return skipped(char === scan.quote ? CODE : scan, 1);
    }
    return null;
};

const codeStep = function codeStep(char: string, pair: string): Step {
    const opener = OPENERS.get(pair);
    if (opener !== undefined) {
        return skipped({ escaped: false, mode: opener, quote: "" }, 2);
    }
    if (QUOTES.has(char)) {
        return skipped({ escaped: false, mode: "quote", quote: char }, 1);
    }
    return { code: true, next: CODE, width: 1 };
};

const stepOf = function stepOf(scan: Scan, source: string, index: number): Step {
    const char = source.charAt(index);
    const pair = source.slice(index, index + 2);
    return commentStep(scan, pair) ?? quoteStep(scan, char) ?? codeStep(char, pair);
};

const scanCode = function scanCode(source: string, at: (index: number, char: string) => boolean): boolean {
    let scan = CODE;
    let index = 0;

    while (index < source.length) {
        const step = stepOf(scan, source, index);
        if (step.code && at(index, source.charAt(index))) {
            return true;
        }
        scan = step.next;
        index += step.width;
    }

    return false;
};

const isIdentifierChar = function isIdentifierChar(char: string): boolean {
    return isWordCharacter(char) || char === "$";
};

const memberCallOpensHere = function memberCallOpensHere(source: string, index: number): boolean {
    let cursor = index - 1;
    while (cursor >= 0 && isIdentifierChar(source.charAt(cursor))) {
        cursor -= 1;
    }
    return cursor !== index - 1 && source.charAt(cursor) === ".";
};

const memberCallFollows = function memberCallFollows(source: string, index: number): boolean {
    let cursor = index + 1;
    while (cursor < source.length && isIdentifierChar(source.charAt(cursor))) {
        cursor += 1;
    }
    return cursor !== index + 1 && source.charAt(cursor) === "(";
};

export const containsInCode = function containsInCode(source: string, needle: string): boolean {
    return scanCode(source, (index) => source.startsWith(needle, index));
};

export const reachesRegexLiteral = function reachesRegexLiteral(source: string): boolean {
    return scanCode(source, (index, char) => {
        const next = source.charAt(index + 1);

        if (char === "(" && next === "/" && source.charAt(index + 2) !== "/") {
            return memberCallOpensHere(source, index);
        }

        return char === "/" && next === "." && memberCallFollows(source, index + 1);
    });
};

export const declaresProperty = function declaresProperty(source: string, name: string): boolean {
    return DECLARATION_TAILS.some((tail) => containsInCode(source, `${name}${tail}`));
};
