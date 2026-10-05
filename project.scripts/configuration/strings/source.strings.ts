export const lengthHeld = function lengthHeld(cap: number, scanned: number): string {
    return `[loc-check] every scanned surface file is under ${String(cap)} lines (${String(scanned)} scanned)\n`;
};

export const lengthBroken = function lengthBroken(cap: number, rows: readonly string[]): string {
    return [`[loc-check] ${String(rows.length)} file(s) over ${String(cap)} lines:`, ...rows, ""].join("\n");
};
