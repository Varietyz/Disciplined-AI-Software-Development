import type { CodeSymbol } from "@govlab/patterns/types/code.types.ts";
import type { FileEntry } from "@govlab/patterns/types/package.types.ts";

export const entry = function entry(rel: string, nodes: number, symbols: CodeSymbol[] = []): FileEntry {
    return {
        records: [{ file: rel, nodeType: "identifier", text: "x" }],
        rel,
        symbols,
        walk: Array.from({ length: nodes }, () => ({ depth: 0, file: rel, label: "call_expression", role: "node" })),
    };
};
