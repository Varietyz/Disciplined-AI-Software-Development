export const containsAny = function containsAny(filename: string, fragments?: readonly string[]): boolean {
    if (!fragments || fragments.length === 0) {
        return false;
    }
    const normalized = filename.split("\\").join("/");
    return fragments.some((fragment) => normalized.includes(fragment));
};
