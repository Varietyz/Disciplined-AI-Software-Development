export interface WalkNode {
    depth: number;
    role: string;
    label: string;
    name?: string;
    line?: number;
    text?: string;
    file?: string;
    state?: string;
    tip?: string;
}

export interface Axial {
    q: number;
    r: number;
}

export interface Cell {
    at: Axial;
    node: WalkNode;
    state: string;
}

export interface WalkCell {
    ref: string;
    state: string;
    depth: number;
    label: string;
    file: string;
    line: number | null;
    name: string;
    text: string;
    severity: string | null;
}

export type PackedRow = [string, number, string, string, number | null, string, string, string | null];

export interface PackedCells {
    columns: readonly string[];
    rows: PackedRow[];
}

export interface Point {
    x: number;
    y: number;
}

export interface HexGridOptions {
    title?: string;
    flagged?: ReadonlyMap<string, string>;
}

export interface StateRule {
    state: string;
    tokens: readonly string[];
}

export interface LegendItem {
    state: string;
    text: string;
}
