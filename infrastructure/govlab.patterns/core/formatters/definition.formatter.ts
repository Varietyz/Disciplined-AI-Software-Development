export const KEY_SEP = "::";

export const keyOf = function keyOf(scope: string, name: string): string {
    return `${scope}${KEY_SEP}${name}`;
};

export const scopeOf = function scopeOf(key: string): string {
    return key.split(KEY_SEP)[0] ?? "";
};
