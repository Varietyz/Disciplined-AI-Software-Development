const WILDCARD = "*";

export const matchesPattern = function matchesPattern(pattern: string, name: string): boolean {
    const parts = pattern.split(WILDCARD);
    if (parts.length === 1) {
        return pattern === name;
    }
    const first = parts[0] ?? "";
    const last = parts.at(-1) ?? "";
    if (!name.startsWith(first) || !name.endsWith(last)) {
        return false;
    }
    if (name.length < first.length + last.length) {
        return false;
    }
    let cursor = first.length;
    for (const middle of parts.slice(1, -1)) {
        const at = name.indexOf(middle, cursor);
        if (at === -1 || at + middle.length > name.length - last.length) {
            return false;
        }
        cursor = at + middle.length;
    }
    return true;
};
