const ROW_MARKER = "|";

const DIVIDER_CELL = "---";

const canonicalCell = function canonicalCell(cell: string): string {
    const trimmed = cell.trim();
    return trimmed.length > 0 && trimmed.replaceAll("-", "").length === 0 ? DIVIDER_CELL : trimmed;
};

const cellsOf = function cellsOf(line: string): string[] {
    return line.trim().split(ROW_MARKER).map(canonicalCell);
};

const canonicalLine = function canonicalLine(line: string): string {
    return line.trim().startsWith(ROW_MARKER) ? cellsOf(line).join(ROW_MARKER) : line.trimEnd();
};

export const sameRow = function sameRow(held: string, rendered: string): boolean {
    const left = cellsOf(held);
    const right = cellsOf(rendered);
    return left.length === right.length && left.every((cell, index) => cell === right[index]);
};

export const sameDocument = function sameDocument(held: string, rendered: string): boolean {
    const left = held
        .split("\n")
        .map(canonicalLine)
        .filter((line) => line.length > 0);
    const right = rendered
        .split("\n")
        .map(canonicalLine)
        .filter((line) => line.length > 0);
    return left.length === right.length && left.every((line, index) => line === right[index]);
};
