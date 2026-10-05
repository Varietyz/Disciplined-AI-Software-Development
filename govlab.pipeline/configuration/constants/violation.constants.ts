export const COUNT_KEYWORDS: readonly string[] = ["error", "problem", "finding", "violation", "advisory"];

export const DIGITS: ReadonlySet<string> = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

export const SOURCE_EXTENSIONS: readonly string[] = [
    ".ts",
    ".tsx",
    ".mts",
    ".cts",
    ".js",
    ".mjs",
    ".cjs",
    ".css",
    ".html",
    ".json",
    ".md",
];

export const MIN_FINDING_PARTS = 2;

export const SGR_OPEN = "\u001B[";

export const SGR_END = "m";

export const SGR_BODY: ReadonlySet<string> = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ";"]);

export const GAP_CHARS: ReadonlySet<string> = new Set([" ", "\t", "\v", "\f", "\r"]);

export const MIN_GAP = 2;

export const CARRIAGE_RETURN = "\r";

export const POSITION_SEPARATOR = ":";

export const MESSAGE_JOIN = "  ";
