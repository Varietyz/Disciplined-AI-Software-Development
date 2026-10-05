import path from "node:path";

const SEPARATOR = "/";
const NEGATION = "!";

const isAnchored = function isAnchored(pattern: string): boolean {
    const body = pattern.endsWith(SEPARATOR) ? pattern.slice(0, -1) : pattern;
    return body.includes(SEPARATOR);
};

const anchoredAt = function anchoredAt(pattern: string, prefix: string): string {
    if (pattern.startsWith(NEGATION)) {
        return NEGATION + anchoredAt(pattern.slice(1), prefix);
    }
    if (!isAnchored(pattern)) {
        return pattern;
    }
    const tail = pattern.startsWith(SEPARATOR) ? pattern.slice(1) : pattern;
    return prefix + SEPARATOR + tail;
};

export const exclusionsFrom = function exclusionsFrom(
    patterns: readonly string[],
    base: string,
    root: string,
): string[] {
    const prefix = path.relative(base, root).split(path.sep).join(SEPARATOR);
    return prefix.length === 0 ? [...patterns] : patterns.map((pattern) => anchoredAt(pattern, prefix));
};
