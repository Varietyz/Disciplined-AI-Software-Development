import { CELL_COLUMNS, HARDEN_TOKENS, REF_RADIX } from "#configuration/constants/walk.constants";
import type { Cell, PackedCells, PackedRow, WalkCell, WalkNode } from "#types/walk.types";
import type { CodeSymbol } from "#types/code.types";
import { keyOf } from "#core/formatters/definition.formatter";
import { walkGrid } from "#core/resolvers/walk.resolver";

const NODE_ROLE = "node";
const TOKEN_BREAK = " ";

export const refOf = function refOf(index: number): string {
    return index.toString(REF_RADIX);
};

const tokenAt = function tokenAt(lower: string, index: number): string | undefined {
    return HARDEN_TOKENS.find((candidate) => lower.startsWith(candidate, index));
};

const brokenToken = function brokenToken(text: string, index: number, token: string): string {
    const last = index + token.length - 1;
    return text.slice(index, last) + TOKEN_BREAK + text.charAt(last);
};

const hardenText = function hardenText(text: string): string {
    const lower = text.toLowerCase();
    let out = "";
    let index = 0;
    while (index < text.length) {
        const token = tokenAt(lower, index);
        out += token === undefined ? text.charAt(index) : brokenToken(text, index, token);
        index += token === undefined ? 1 : token.length;
    }
    return out;
};

const cellText = function cellText(node: WalkNode): string {
    if (node.tip !== undefined) {
        return node.tip;
    }
    return node.text !== undefined && node.text.length > 0 ? node.text : node.label;
};

export const severityOf = function severityOf(cell: Cell, flagged: ReadonlyMap<string, string>): string | undefined {
    return flagged.get(keyOf(cell.node.file ?? "", cell.node.name ?? ""));
};

export const walkCells = function walkCells(
    nodes: readonly WalkNode[],
    flagged: ReadonlyMap<string, string> = new Map(),
): WalkCell[] {
    return walkGrid(nodes).map((cell, index) => ({
        depth: cell.node.depth,
        file: cell.node.file ?? "",
        label: cell.node.label,
        line: cell.node.line ?? null,
        name: cell.node.name ?? "",
        ref: refOf(index),
        severity: severityOf(cell, flagged) ?? null,
        state: cell.state,
        text: hardenText(cellText(cell.node)),
    }));
};

export const packCells = function packCells(cells: readonly WalkCell[]): PackedCells {
    return {
        columns: CELL_COLUMNS,
        rows: cells.map((cell): PackedRow => [
            cell.state,
            cell.depth,
            cell.label,
            cell.file,
            cell.line,
            cell.name,
            cell.text,
            cell.severity,
        ]),
    };
};

export const unpackCells = function unpackCells(packed: PackedCells): WalkCell[] {
    return packed.rows.map(([state, depth, label, file, line, name, text, severity], index) => ({
        depth,
        file,
        label,
        line,
        name,
        ref: refOf(index),
        severity,
        state,
        text,
    }));
};

const textOf = function textOf(record: Record<string, unknown>, key: string, fallback: string): string {
    const value = record[key];
    return typeof value === "string" ? value : fallback;
};

const numberOf = function numberOf(record: Record<string, unknown>, key: string): number {
    const value = record[key];
    return typeof value === "number" ? value : 0;
};

export const namedWalk = function namedWalk(
    records: readonly Record<string, unknown>[],
    symbols: readonly CodeSymbol[],
): WalkNode[] {
    const byKey = new Map<string, string>();
    for (const symbol of symbols) {
        const site = `${symbol.role}:${symbol.line}`;
        if (!byKey.has(site)) {
            byKey.set(site, symbol.name);
        }
    }
    return records.map((record) => {
        const base: WalkNode = {
            depth: numberOf(record, "depth"),
            file: textOf(record, "file", ""),
            label: textOf(record, "nodeType", NODE_ROLE),
            line: numberOf(record, "line"),
            role: textOf(record, "role", NODE_ROLE),
            text: textOf(record, "text", ""),
        };
        const name = byKey.get(`${base.role}:${base.line ?? 0}`);
        return name === undefined ? base : { ...base, name };
    });
};
