const NON_PATH_CHARS = ["<", ">", "(", ")", ",", "::", "${", "*", "\\"];

const isSpecifier = function isSpecifier(value: string): boolean {
    return value.startsWith("@") || value.startsWith("http") || value.startsWith("node:");
};

export const isSegmentLike = function isSegmentLike(value: string): boolean {
    if (value.length < 2) {
        return false;
    }
    if (value.includes(" ") || value.includes("\n")) {
        return false;
    }
    for (const c of NON_PATH_CHARS) {
        if (value.includes(c)) {
            return false;
        }
    }
    if (value.startsWith("-") || isSpecifier(value)) {
        return false;
    }
    return !value.endsWith(".json");
};

const MIN_PATH_SEGMENTS = 2;

const SYSTEM_ROOTS: ReadonlySet<string> = new Set(["usr", "opt", "bin", "etc", "var", "tmp", "Applications"]);

const segmentCount = function segmentCount(value: string): number {
    return value.split("/").filter((segment) => segment.length > 0).length;
};

const isSystemPath = function isSystemPath(value: string): boolean {
    return value.startsWith("/") && SYSTEM_ROOTS.has(value.split("/")[1] ?? "");
};

const MEDIA_TOP_LEVEL_TYPES: ReadonlySet<string> = new Set([
    "application",
    "audio",
    "font",
    "image",
    "message",
    "model",
    "multipart",
    "text",
    "video",
]);

const WORD_STOPS: ReadonlySet<string> = new Set(['"', "'", "=", "[", " "]);

const wordBefore = function wordBefore(text: string, end: number): string {
    let start = end;
    while (start > 0 && !WORD_STOPS.has(text.charAt(start - 1))) {
        start -= 1;
    }
    return text.slice(start, end);
};

const isMediaType = function isMediaType(value: string): boolean {
    const slash = value.indexOf("/");
    if (slash === -1 || value.includes("/", slash + 1)) {
        return false;
    }
    return MEDIA_TOP_LEVEL_TYPES.has(wordBefore(value, slash));
};

export const isPathLike = function isPathLike(value: string): boolean {
    if (value.length < 4) {
        return false;
    }
    if (!isSegmentLike(value) || isSystemPath(value) || isMediaType(value)) {
        return false;
    }
    if (value.startsWith(".")) {
        return false;
    }
    if (value.includes("/")) {
        return segmentCount(value) >= MIN_PATH_SEGMENTS;
    }
    return value.endsWith(".ts");
};

const skipToLineEnd = function skipToLineEnd(text: string, at: number): number {
    const nl = text.indexOf("\n", at);
    return nl === -1 ? text.length : nl;
};

const skipToBlockEnd = function skipToBlockEnd(text: string, at: number): number {
    const end = text.indexOf("*/", at + 2);
    return end === -1 ? text.length : end + 2;
};

export const stripComments = function stripComments(text: string): string {
    let out = "";
    let i = 0;
    while (i < text.length) {
        if (text.startsWith("//", i)) {
            i = skipToLineEnd(text, i);
        } else if (text.startsWith("/*", i)) {
            i = skipToBlockEnd(text, i);
        } else {
            out += text[i];
            i += 1;
        }
    }
    return out;
};

const QUOTES = new Set(['"', "'"]);

export const stringLiteralsOf = function stringLiteralsOf(text: string): string[] {
    const out: string[] = [];
    let i = 0;
    while (i < text.length) {
        const ch = text[i] ?? "";
        if (!QUOTES.has(ch)) {
            i += 1;
            continue;
        }
        const close = text.indexOf(ch, i + 1);
        if (close === -1) {
            return out;
        }
        const body = text.slice(i + 1, close);
        if (!body.includes("\n")) {
            out.push(body);
        }
        i = close + 1;
    }
    return out;
};

const PATH_QUALIFIER = "path.";

const isPathJoin = function isPathJoin(text: string, at: number): boolean {
    if (at === 0) {
        return true;
    }
    if (text[at - 1] !== ".") {
        return true;
    }
    return text.slice(Math.max(0, at - PATH_QUALIFIER.length), at) === PATH_QUALIFIER;
};

export const joinedPathsOf = function joinedPathsOf(text: string): string[] {
    const out: string[] = [];
    const marker = "join(";
    let at = text.indexOf(marker);
    while (at >= 0) {
        const close = text.indexOf(")", at);
        if (close === -1) {
            break;
        }
        const segments = isPathJoin(text, at)
            ? stringLiteralsOf(text.slice(at + marker.length, close)).filter(
                  (s) => s !== ".." && s !== "." && s.length > 0,
              )
            : [];
        if (segments.length > 0) {
            out.push(segments.join("/"));
        }
        at = text.indexOf(marker, close);
    }
    return out;
};

const HINT_MARKER = "_HINTS";

export const hintLiteralsOf = function hintLiteralsOf(text: string): Set<string> {
    const out = new Set<string>();
    let at = text.indexOf(HINT_MARKER);
    while (at >= 0) {
        const open = text.indexOf("[", at);
        const close = open === -1 ? -1 : text.indexOf("]", open);
        if (open !== -1 && close > open) {
            for (const s of stringLiteralsOf(text.slice(open, close))) {
                out.add(s);
            }
        }
        at = text.indexOf(HINT_MARKER, at + HINT_MARKER.length);
    }
    return out;
};
