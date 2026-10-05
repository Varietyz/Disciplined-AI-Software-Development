const EXTERNAL_PREFIXES: readonly string[] = ["/", "~", "@"];
const SCHEME_MARKER = "://";
const RELATIVE_PREFIXES: readonly string[] = ["./", "../"];

export const isExternalTarget = function isExternalTarget(target: string): boolean {
    if (target === "" || target.includes(SCHEME_MARKER)) {
        return true;
    }
    return EXTERNAL_PREFIXES.some((prefix) => target.startsWith(prefix));
};

export const isRelativeTarget = function isRelativeTarget(target: string): boolean {
    return RELATIVE_PREFIXES.some((prefix) => target.startsWith(prefix));
};
