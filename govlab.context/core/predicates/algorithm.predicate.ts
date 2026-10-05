import type { SymbolEntry } from "#types/algorithm.types";

export const symbolIndexesMatch = function symbolIndexesMatch(
    committed: readonly SymbolEntry[],
    generated: readonly SymbolEntry[],
): boolean {
    return JSON.stringify(committed) === JSON.stringify(generated);
};
