import type { UngatedRow } from "../types/blocking.types.ts";

const CELL = "|";

const cellsOf = function cellsOf(line: string): string[] {
    const trimmed = line.trim();
    if (!trimmed.startsWith(CELL)) {
        return [];
    }

    const parts = trimmed.split(CELL);
    return parts.slice(1, -1).map((part) => part.trim());
};

const isSeparator = function isSeparator(cells: readonly string[]): boolean {
    for (const cell of cells) {
        for (const char of cell) {
            if (char !== "-" && char !== ":" && char !== " ") {
                return false;
            }
        }
    }
    return cells.length > 0;
};

const ungatedRow = function ungatedRow(cells: readonly string[], width: number, index: number): UngatedRow | null {
    const gated = (cells.at(-1) ?? "").length > 0;
    return cells.length === width && !gated ? { id: cells[0] ?? "", line: index + 1 } : null;
};

const nextWidth = function nextWidth(cells: readonly string[], width: number): number {
    if (cells.length === 0) {
        return 0;
    }
    return width !== 0 || isSeparator(cells) ? width : cells.length;
};

export const ungatedRows = function ungatedRows(source: string): UngatedRow[] {
    const rows: UngatedRow[] = [];
    let width = 0;

    for (const [index, line] of source.split("\n").entries()) {
        const cells = cellsOf(line);
        const body = cells.length > 0 && width !== 0 && !isSeparator(cells);
        const row = body ? ungatedRow(cells, width, index) : null;
        width = nextWidth(cells, width);
        if (row !== null) {
            rows.push(row);
        }
    }

    return rows;
};
