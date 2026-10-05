import type { Axial, Cell, WalkNode } from "#types/walk.types";
import { HALF } from "#configuration/constants/walk.constants";
import { stateOf } from "#core/classifiers/syntax.classifier";

const CONTAIN_FACTOR = 0.55;
const OVERFLOW_WEIGHT = 40;
const RADIUS_MIN = 2;
const SPIRAL_RINGS = 240;

const N: Axial = { q: 0, r: -1 };
const S: Axial = { q: 0, r: 1 };
const NE: Axial = { q: 1, r: -1 };
const SE: Axial = { q: 1, r: 0 };
const SW: Axial = { q: -1, r: 1 };
const NW: Axial = { q: -1, r: 0 };
const ALL_DIRS: readonly Axial[] = [N, S, NE, SE, SW, NW];
const DOWN_PREF: readonly Axial[] = [S, SE, SW, NE, NW, N];
const UP_PREF: readonly Axial[] = [N, NE, NW, SE, SW, S];
const SIDE_PREF: readonly Axial[] = [SE, NE, SW, NW, S, N];

interface Scored {
    at: Axial;
    score: number;
}

interface WalkBounds {
    visited: ReadonlySet<string>;
    radius: number;
}

const key = function key(cell: Axial): string {
    return `${cell.q},${cell.r}`;
};

const add = function add(a: Axial, b: Axial): Axial {
    return { q: a.q + b.q, r: a.r + b.r };
};

const hexDist = function hexDist(cell: Axial): number {
    return (Math.abs(cell.q) + Math.abs(cell.r) + Math.abs(cell.q + cell.r)) * HALF;
};

const prefsFor = function prefsFor(delta: number): readonly Axial[] {
    if (delta > 0) {
        return DOWN_PREF;
    }
    return delta < 0 ? UP_PREF : SIDE_PREF;
};

const ringCells = function ringCells(center: Axial, radius: number): Axial[] {
    const cells: Axial[] = [];
    let cell = { q: center.q + SW.q * radius, r: center.r + SW.r * radius };
    for (const dir of ALL_DIRS) {
        for (let step = 0; step < radius; step += 1) {
            cells.push(cell);
            cell = add(cell, dir);
        }
    }
    return cells;
};

const spiralFree = function spiralFree(cursor: Axial, visited: ReadonlySet<string>): Axial {
    for (let radius = 1; radius < SPIRAL_RINGS; radius += 1) {
        const free = ringCells(cursor, radius).find((cell) => !visited.has(key(cell)));
        if (free !== undefined) {
            return free;
        }
    }
    return cursor;
};

const pickNext = function pickNext(cursor: Axial, prefs: readonly Axial[], bounds: WalkBounds): Axial {
    const free: Scored[] = prefs
        .map((dir, rank) => {
            const at = add(cursor, dir);
            return { at, score: rank + Math.max(0, hexDist(at) - bounds.radius) * OVERFLOW_WEIGHT };
        })
        .filter((option) => !bounds.visited.has(key(option.at)));
    const [head] = free;
    if (!head) {
        return spiralFree(cursor, bounds.visited);
    }
    return free.reduce((best, option) => (option.score < best.score ? option : best), head).at;
};

export const walkGrid = function walkGrid(nodes: readonly WalkNode[]): Cell[] {
    const [first] = nodes;
    if (!first) {
        return [];
    }
    const radius = Math.max(RADIUS_MIN, Math.ceil(Math.sqrt(nodes.length) * CONTAIN_FACTOR));
    const origin: Axial = { q: 0, r: 0 };
    const visited = new Set<string>([key(origin)]);
    const cells: Cell[] = [{ at: origin, node: first, state: first.state ?? stateOf(first.label) }];
    let cursor = origin;
    let previous = first.depth;
    for (const node of nodes.slice(1)) {
        const next = pickNext(cursor, prefsFor(node.depth - previous), { radius, visited });
        visited.add(key(next));
        cells.push({ at: next, node, state: node.state ?? stateOf(node.label) });
        cursor = next;
        previous = node.depth;
    }
    return cells;
};
