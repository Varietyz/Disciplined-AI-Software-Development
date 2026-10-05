import type {
    Curve,
    FrameContext,
    LayoutSlot,
    Orientation,
    OrientedLayout,
    Placement,
    SlotOptions,
    TextAlign,
} from "#types/card.types";
import { DEFAULT_ALIGN, WIDE_RATIO } from "#configuration/constants/card.constants";
import { SUBJECT_SEPARATOR, UNKNOWN_CURVE } from "#configuration/strings/card.strings";

const CUBE = 3;
const HALF = 0.5;
const BACK = 1.70158;
const TURN = Math.PI * 2;
const NOISE_A = 12.9898;
const NOISE_B = 78.233;
const NOISE_SCALE = 43_758.5453;
const PIXEL_PRECISION = 100;
const PIXEL_UNIT = "px";

const CURVES: ReadonlyMap<Curve, (x: number) => number> = new Map<Curve, (x: number) => number>([
    ["linear", (x) => x],
    ["inCubic", (x) => x ** CUBE],
    ["outCubic", (x) => 1 - (1 - x) ** CUBE],
    ["inOutCubic", (x) => (x < HALF ? 4 * x ** CUBE : 1 - (-2 * x + 2) ** CUBE / 2)],
    ["inOutSine", (x) => -(Math.cos(Math.PI * x) - 1) / 2],
    ["outBack", (x) => 1 + (BACK + 1) * (x - 1) ** CUBE + BACK * (x - 1) ** 2],
]);

export const clamp = function clamp(value: number, low = 0, high = 1): number {
    return Math.min(high, Math.max(low, value));
};

export const lerp = function lerp(from: number, to: number, amount: number): number {
    return from + (to - from) * amount;
};

export const ease = function ease(progress: number, curve: Curve = "inOutCubic"): number {
    const shape = CURVES.get(curve);
    if (shape === undefined) {
        throw new Error(UNKNOWN_CURVE + SUBJECT_SEPARATOR + curve);
    }
    return shape(clamp(progress));
};

export const between = function between(progress: number, start: number, end: number): number {
    return end <= start ? Number(progress >= end) : clamp((progress - start) / (end - start));
};

export const wave = function wave(progress: number, cycles = 1, phase = 0): number {
    return (Math.sin((progress * cycles + phase) * TURN) + 1) / 2;
};

export const stagger = function stagger(progress: number, index: number, step: number, span: number): number {
    return between(progress, index * step, index * step + span);
};

export const noise = function noise(seed: number, x = 0): number {
    const value = Math.sin(seed * NOISE_A + x * NOISE_B) * NOISE_SCALE;
    return value - Math.floor(value);
};

export const pixels = function pixels(value: number): string {
    return `${String(Math.round(value * PIXEL_PRECISION) / PIXEL_PRECISION)}${PIXEL_UNIT}`;
};

export const pixelValue = function pixelValue(text: string): number {
    const bare = (text.endsWith(PIXEL_UNIT) ? text.slice(0, -PIXEL_UNIT.length) : text).trim();
    return bare === "" ? Number.NaN : Number(bare);
};

export const percent = function percent(value: number): string {
    return `${String(value)}%`;
};

export const swing = function swing(progress: number, cycles = 1, phase = 0): number {
    return Math.sin((progress * cycles + phase) * TURN);
};

export const orientationOf = function orientationOf(frame: FrameContext): Orientation {
    return frame.profile.width / frame.profile.height >= WIDE_RATIO ? "wide" : "square";
};

export const slotAt = function slotAt<K extends string>(
    layout: OrientedLayout<K>,
    key: K,
    frame: FrameContext,
): LayoutSlot {
    return layout[orientationOf(frame)][key];
};

export const squareHeight = function squareHeight(width: number, frame: FrameContext): number {
    return (width * frame.profile.width) / frame.profile.height;
};

export const placeAt = function placeAt<K extends string>(
    layout: OrientedLayout<K>,
    key: K,
    options: SlotOptions = {},
): Placement {
    const grown = (frame: FrameContext): number => slotAt(layout, key, frame).width * (options.grow?.(frame) ?? 1);
    return {
        anchor: (frame) => slotAt(layout, key, frame).anchor,
        height: (frame) =>
            options.square === true ? squareHeight(grown(frame), frame) : (slotAt(layout, key, frame).height ?? 0),
        width: grown,
        x: (frame) => slotAt(layout, key, frame).x,
        y: (frame) => slotAt(layout, key, frame).y + (options.lift?.(frame) ?? 0),
    };
};

export const fontAt = function fontAt<K extends string>(layout: OrientedLayout<K>, key: K) {
    return (frame: FrameContext): string => pixels(frame.profile.width * (slotAt(layout, key, frame).size ?? 0));
};

export const alignAt = function alignAt<K extends string>(layout: OrientedLayout<K>, key: K) {
    return (frame: FrameContext): TextAlign => slotAt(layout, key, frame).align ?? DEFAULT_ALIGN;
};
