import type { ColumnBox, ColumnEntry, ColumnRow, ColumnSpec, FrameContext } from "#types/card.types";
import { HOME_PATH, pagePath } from "@banes-lab/web/core/assets/link.assets.ts";
import { MONO_ADVANCE } from "#configuration/constants/card.constants";
import { SITE_HOST } from "#configuration/data/site.data";

export const pageAddress = function pageAddress(page: string): string {
    const path = pagePath(page);
    return path === HOME_PATH ? SITE_HOST : SITE_HOST + path;
};

const WORD_SEPARATOR = " ";
const HALF = 2;

export const wrapCount = function wrapCount(text: string, columns: number): number {
    const limit = Math.max(1, Math.floor(columns));
    let lines = 1;
    let used = 0;
    for (const word of text.split(WORD_SEPARATOR)) {
        const needed = used === 0 ? word.length : used + 1 + word.length;
        if (needed <= limit || used === 0) {
            used = needed;
        } else {
            lines += 1;
            used = word.length;
        }
    }
    return lines;
};

const rowHeight = function rowHeight(spec: ColumnSpec, entry: ColumnEntry, frame: FrameContext): number {
    const row = spec.rows[entry.row];
    const size = row.size * frame.profile.width;
    if (entry.text.length === 0) {
        return size / frame.profile.height;
    }
    const columns = (spec.width * frame.profile.width) / (MONO_ADVANCE * size);
    return (wrapCount(entry.text, columns) * size * row.leading) / frame.profile.height;
};

const rowX = function rowX(spec: ColumnSpec, width: number): number {
    if (spec.align === "center") {
        return spec.x + (spec.width - width) / HALF;
    }
    return spec.align === "right" ? spec.x + spec.width - width : spec.x;
};

export const columnOf = function columnOf(
    spec: ColumnSpec,
    entries: readonly ColumnEntry[],
    frame: FrameContext,
): ReadonlyMap<ColumnRow, ColumnBox> {
    const heights = entries.map((entry) => rowHeight(spec, entry, frame));
    const gaps = entries.map((entry, index) => (index === 0 ? 0 : spec.rows[entry.row].gap));
    const total = heights.reduce((sum, height, index) => sum + height + (gaps[index] ?? 0), 0);
    let top = spec.y - total / HALF;
    const boxes = new Map<ColumnRow, ColumnBox>();
    entries.forEach((entry, index) => {
        top += gaps[index] ?? 0;
        const width = spec.rows[entry.row].width ?? spec.width;
        const height = heights[index] ?? 0;
        boxes.set(entry.row, { height, width, x: rowX(spec, width), y: top });
        top += height;
    });
    return boxes;
};
