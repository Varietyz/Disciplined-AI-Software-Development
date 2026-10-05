import type { ColumnSpec, Orientation, OrientedLayout, PageSlot, Timeline } from "#types/card.types";

export const PAGE_TIMELINE: Timeline = { fps: 20, frames: 60, keyFrame: 30, loop: true };

export const PAGE_LAYOUT: OrientedLayout<PageSlot> = {
    square: {
        byline: { align: "left", anchor: "end", size: 0.017, width: 0.4, x: 0.46, y: 0.92 },
        domain: { align: "right", anchor: "end", size: 0.017, width: 0.52, x: 0.94, y: 0.92 },
        mark: { anchor: "center", size: 0.18, width: 0.28, x: 0.5, y: 0.28 },
    },
    wide: {
        byline: { align: "left", anchor: "end", size: 0.0135, width: 0.3, x: 0.345, y: 0.92 },
        domain: { align: "right", anchor: "end", size: 0.0135, width: 0.6, x: 0.955, y: 0.92 },
        mark: { anchor: "center", size: 0.12, width: 0.22, x: 0.235, y: 0.5 },
    },
};

export const PAGE_COLUMN: Readonly<Record<Orientation, ColumnSpec>> = {
    square: {
        align: "center",
        rows: {
            kicker: { gap: 0, leading: 1.5, size: 0.019 },
            rule: { gap: 0.05, leading: 1, size: 0.0037, width: 0.34 },
            subtitle: { gap: 0.035, leading: 1.5, size: 0.029 },
            title: { gap: 0.012, leading: 1.1, size: 0.06 },
        },
        width: 0.92,
        x: 0.04,
        y: 0.69,
    },
    wide: {
        align: "left",
        rows: {
            kicker: { gap: 0, leading: 1.5, size: 0.0145 },
            rule: { gap: 0.05, leading: 1, size: 0.003, width: 0.3 },
            subtitle: { gap: 0.05, leading: 1.5, size: 0.02 },
            title: { gap: 0.02, leading: 1.1, size: 0.05 },
        },
        width: 0.52,
        x: 0.44,
        y: 0.5,
    },
};

export const PAGE_GLOW_BASE = 10;

export const PAGE_GLOW_OPACITY = 0.5;

export const PAGE_GLOW_SWING = 12;

export const PAGE_SHIMMER_SPAN = 100;

export const PAGE_POOL_REACH = 0.12;

export const PAGE_POOL_SIZE = 0.9;

export const PAGE_POOL_ORIGINS: readonly (readonly [number, number])[] = [
    [0.25, 0.45],
    [0.8, 0.3],
    [0.6, 1],
];

export const PAGE_POOL_OPACITY: readonly number[] = [0.22, 0.12, 0.1];
