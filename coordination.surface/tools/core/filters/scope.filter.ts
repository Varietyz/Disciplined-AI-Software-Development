export const underRoots = function underRoots(paths: readonly string[], roots: readonly string[]): string[] {
    const out: string[] = [];
    for (const path of paths) {
        for (const root of roots) {
            if (path.startsWith(root)) {
                out.push(path);
                break;
            }
        }
    }
    return out;
};

export const outsideRoots = function outsideRoots(paths: readonly string[], roots: readonly string[]): string[] {
    const excluded = new Set(underRoots(paths, roots));
    const out: string[] = [];
    for (const path of paths) {
        if (!excluded.has(path)) {
            out.push(path);
        }
    }
    return out;
};
