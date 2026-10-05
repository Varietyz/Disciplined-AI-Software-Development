import type { BuildResult } from "#types/grammar.types";

export const extensionMapOf = function extensionMapOf(results: readonly BuildResult[]): Record<string, string[]> {
    const entries = results
        .filter((result) => result.fileTypes.length > 0)
        .map((result): [string, string[]] => [
            result.lang,
            [...new Set(result.fileTypes)].toSorted((a, b) => a.localeCompare(b)),
        ]);
    return Object.fromEntries(entries.toSorted(([a], [b]) => a.localeCompare(b)));
};
