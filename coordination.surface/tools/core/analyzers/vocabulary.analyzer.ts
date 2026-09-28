import type { Declared } from "../types/vocabulary.types.ts";
import { lifetime } from "../../../config/surface.config.ts";

const CELL = "|";

export const CLOSED: Readonly<Record<string, readonly string[]>> = {
    mutability: lifetime.values.mutability,
    removal: lifetime.values.removal,
    retention: lifetime.values.retention,
};

const MARKUP = new Set(["`", "*", "_", " "]);

const SEPARATORS = new Set(["·", ",", "/"]);

const WORD_BREAK = new Set([" ", "\t", "-"]);

const SPACING = new Set([" ", "\t"]);

const AXIS_COLUMN = lifetime.columns.axis;

const VALUE_COLUMN = lifetime.columns.value;

interface Columns {
    readonly axis: number;
    readonly value: number;
}

const bare = function bare(cell: string): string {
    let start = 0;
    let end = cell.length;

    while (start < end && MARKUP.has(cell[start] ?? "")) {
        start += 1;
    }
    while (end > start && MARKUP.has(cell[end - 1] ?? "")) {
        end -= 1;
    }

    return cell.slice(start, end).toLowerCase();
};

const tokens = function tokens(value: string): string[] {
    const out: string[] = [];
    let held = "";

    for (const char of value) {
        if (!SEPARATORS.has(char)) {
            held += char;
            continue;
        }
        const token = bare(held);
        if (token.length > 0) {
            out.push(token);
        }
        held = "";
    }

    const last = bare(held);
    if (last.length > 0) {
        out.push(last);
    }
    return out;
};

const splitOn = function splitOn(text: string, breaks: ReadonlySet<string>): string[] {
    const out: string[] = [];
    let held = "";

    for (const char of text) {
        if (!breaks.has(char)) {
            held += char;
            continue;
        }
        if (held.length > 0) {
            out.push(held);
        }
        held = "";
    }

    if (held.length > 0) {
        out.push(held);
    }
    return out;
};

const axisNamedBy = function axisNamedBy(cell: string): string | null {
    for (const word of splitOn(cell, WORD_BREAK)) {
        if (CLOSED[word] !== undefined) {
            return word;
        }
    }
    return null;
};

const columnsOf = function columnsOf(row: readonly string[]): Columns | null {
    let axis = -1;
    let value = -1;

    for (let at = 0; at < row.length; at += 1) {
        const label = bare(row[at] ?? "");
        if (label === AXIS_COLUMN) {
            axis = at;
        }
        if (label === VALUE_COLUMN) {
            value = at;
        }
    }

    return axis === -1 || value === -1 ? null : { axis, value };
};

const statesTheSet = function statesTheSet(axis: string, value: string): boolean {
    const closed = CLOSED[axis] ?? [];
    const parts = tokens(value);
    if (parts.length < 2) {
        return false;
    }

    for (const part of parts) {
        if (!closed.includes(part)) {
            return false;
        }
    }
    return true;
};

const definesTheAxis = function definesTheAxis(value: string): boolean {
    return splitOn(value, SPACING).length > 1;
};

const cells = function cells(line: string): string[] {
    const trimmed = line.trim();
    if (!trimmed.startsWith(CELL)) {
        return [];
    }

    const out: string[] = [];
    for (const part of trimmed.split(CELL)) {
        const cell = part.trim();
        if (cell.length > 0) {
            out.push(cell);
        }
    }
    return out;
};

const declaredRow = function declaredRow(row: readonly string[], columns: Columns, line: number): Declared[] {
    const axis = axisNamedBy(bare(row[columns.axis] ?? ""));
    const value = bare(row[columns.value] ?? "");
    if (axis === null || value.length === 0 || statesTheSet(axis, value) || definesTheAxis(value)) {
        return [];
    }
    return [{ axis, line, value }];
};

export const declaredIn = function declaredIn(source: string): Declared[] {
    const found: Declared[] = [];
    let columns: Columns | null = null;

    for (const [index, line] of source.split("\n").entries()) {
        const row = cells(line);
        if (row.length === 0) {
            columns = null;
        } else if (columns === null) {
            columns = columnsOf(row);
        } else {
            found.push(...declaredRow(row, columns, index + 1));
        }
    }

    return found;
};
