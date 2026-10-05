import type { Axial, Cell, HexGridOptions, Point, WalkNode } from "#types/walk.types";
import { DEFAULT_WALK_TITLE, EMPTY_WALK_NOTE, WARN_MARK } from "#configuration/strings/walk.strings";
import {
    HALF,
    HEX_ARROW_CLASS,
    HEX_CLASS,
    HEX_EMPTY_CLASS,
    HEX_FLAG_PREFIX,
    HEX_PATH_CLASS,
    HEX_REF_ATTRIBUTE,
    HEX_STATE_PREFIX,
    HEX_WARN_CLASS,
    HEX_WARN_PREFIX,
    HEX_WARN_TEXT_CLASS,
} from "#configuration/constants/walk.constants";
import { refOf, severityOf } from "#core/converters/walk.converter";
import { escapeXml } from "#core/formatters/markup.formatter";
import { roundTo } from "#core/normalizers/math.normalizer";
import { walkGrid } from "#core/resolvers/walk.resolver";

const PRECISION = 2;
const HEX_SIZE = 15;
const HEX_SIDES = 6;
const HEX_ANGLE_STEP = 60;
const DOUBLE = 2;
const HALF_TURN = 180;
const DEG_TO_RAD = Math.PI / HALF_TURN;
const COL_RATIO = 1.5;
const SQRT3 = Math.sqrt(3);
const ARROW_EVERY = 6;
const ARROW_LEN = 6;
const ARROW_WIDE = 3.2;
const MARGIN = 32;
const WARN_SCALE = 0.66;
const WARN_WIDE = 0.86;
const EMPTY_W = 360;
const EMPTY_H = 120;
const EMPTY_CX = 180;
const EMPTY_CY = 64;
const SVG_NS = "http://www.w3.org/2000/svg";

interface Bounds {
    minX: number;
    minY: number;
    width: number;
    height: number;
}

const round = function round(value: number): number {
    return roundTo(value, PRECISION);
};

const pair = function pair(x: number, y: number): string {
    return `${round(x)},${round(y)}`;
};

const flatTopPixel = function flatTopPixel(cell: Axial): Point {
    return { x: round(HEX_SIZE * COL_RATIO * cell.q), y: round(HEX_SIZE * SQRT3 * (cell.r + cell.q * HALF)) };
};

const hexCorners = function hexCorners(center: Point): string {
    return Array.from({ length: HEX_SIDES }, (_, corner) => {
        const angle = DEG_TO_RAD * HEX_ANGLE_STEP * corner;
        return pair(center.x + HEX_SIZE * Math.cos(angle), center.y + HEX_SIZE * Math.sin(angle));
    }).join(" ");
};

const boundsOf = function boundsOf(centers: readonly Point[]): Bounds {
    const xs = centers.map((point) => point.x);
    const ys = centers.map((point) => point.y);
    const pad = HEX_SIZE + MARGIN;
    return {
        height: Math.max(...ys) - Math.min(...ys) + pad * DOUBLE,
        minX: Math.min(...xs) - HEX_SIZE - MARGIN,
        minY: Math.min(...ys) - HEX_SIZE - MARGIN,
        width: Math.max(...xs) - Math.min(...xs) + pad * DOUBLE,
    };
};

const warnMark = function warnMark(center: Point, severity: string): string {
    const size = HEX_SIZE * WARN_SCALE;
    const tip = pair(center.x, center.y - size);
    const left = pair(center.x - size * WARN_WIDE, center.y + size * HALF);
    const right = pair(center.x + size * WARN_WIDE, center.y + size * HALF);
    const polygon = `<polygon class="${HEX_WARN_CLASS} ${HEX_WARN_PREFIX}${escapeXml(severity)}" points="${tip} ${left} ${right}"/>`;
    return `${polygon}<text class="${HEX_WARN_TEXT_CLASS}" x="${round(center.x)}" y="${round(center.y + size * HALF)}" font-size="${round(size)}" text-anchor="middle">${WARN_MARK}</text>`;
};

const renderCell = function renderCell(
    cell: Cell,
    index: number,
    center: Point,
    flagged: ReadonlyMap<string, string>,
): string {
    const severity = severityOf(cell, flagged);
    const base = `${HEX_CLASS} ${HEX_STATE_PREFIX}${cell.state}`;
    const classes = severity === undefined ? base : `${base} ${HEX_FLAG_PREFIX}${severity}`;
    const polygon = `<polygon class="${escapeXml(classes)}" ${HEX_REF_ATTRIBUTE}="${refOf(index)}" points="${hexCorners(center)}"/>`;
    return severity === undefined ? polygon : polygon + warnMark(center, severity);
};

const arrowAt = function arrowAt(from: Point, to: Point): string {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const [ux, uy] = [dx / len, dy / len];
    const mid: Point = { x: (from.x + to.x) * HALF, y: (from.y + to.y) * HALF };
    const reach = ARROW_LEN * HALF;
    const base: Point = { x: mid.x - ux * reach, y: mid.y - uy * reach };
    const tip = pair(mid.x + ux * reach, mid.y + uy * reach);
    const left = pair(base.x - uy * ARROW_WIDE, base.y + ux * ARROW_WIDE);
    const right = pair(base.x + uy * ARROW_WIDE, base.y - ux * ARROW_WIDE);
    return `<polygon class="${HEX_ARROW_CLASS}" points="${tip} ${left} ${right}"/>`;
};

const pointText = function pointText(point: Point): string {
    return `${point.x},${point.y}`;
};

const renderFlow = function renderFlow(centers: readonly Point[]): string {
    const line = `<polyline class="${HEX_PATH_CLASS}" points="${centers.map(pointText).join(" ")}"/>`;
    const arrows = centers.flatMap((to, index) => {
        const from = centers[index - 1];
        return index >= ARROW_EVERY && index % ARROW_EVERY === 0 && from !== undefined ? [arrowAt(from, to)] : [];
    });
    return line + arrows.join("");
};

const svgDoc = function svgDoc(width: number, height: number, body: string): string {
    return `<svg xmlns="${SVG_NS}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">${body}</svg>`;
};

export const renderHexGrid = function renderHexGrid(nodes: readonly WalkNode[], options: HexGridOptions = {}): string {
    const title = options.title ?? DEFAULT_WALK_TITLE;
    const cells = walkGrid(nodes);
    if (cells.length === 0) {
        const note = escapeXml(title + EMPTY_WALK_NOTE);
        const label = `<text class="${HEX_EMPTY_CLASS}" x="${EMPTY_CX}" y="${EMPTY_CY}" text-anchor="middle">${note}</text>`;
        return svgDoc(EMPTY_W, EMPTY_H, label);
    }
    const bounds = boundsOf(cells.map((cell) => flatTopPixel(cell.at)));
    const centers = cells.map((cell) => {
        const pixel = flatTopPixel(cell.at);
        return { x: round(pixel.x - bounds.minX), y: round(pixel.y - bounds.minY) };
    });
    const flagged = options.flagged ?? new Map<string, string>();
    const body = cells
        .map((cell, index) => renderCell(cell, index, centers[index] ?? { x: 0, y: 0 }, flagged))
        .join("");
    return svgDoc(round(bounds.width), round(bounds.height), body + renderFlow(centers));
};
