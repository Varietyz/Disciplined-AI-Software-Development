import type { Curve, FrameContext, OrientedLayout } from "@banes-lab/social-share/types/card.types.ts";
import {
    alignAt,
    between,
    clamp,
    ease,
    fontAt,
    lerp,
    noise,
    orientationOf,
    percent,
    pixelValue,
    pixels,
    placeAt,
    slotAt,
    squareHeight,
    stagger,
    wave,
} from "@banes-lab/social-share/core/evaluators/card.fragment.evaluator.ts";
import { describe, expect, it } from "vitest";
import { valueAt } from "@banes-lab/social-share/core/evaluators/card.evaluator.ts";

const isForgedCurve = function isForgedCurve(name: string): name is Curve {
    return name.length > 0;
};

const frameOf = function frameOf(width: number, height: number, progress = 0): FrameContext {
    return { frame: 0, frames: 10, profile: { height, id: "p", width }, progress, t: 0 };
};

const WIDE = frameOf(1200, 630);
const SQUARE = frameOf(1080, 1080);

const LAYOUT: OrientedLayout<"mark" | "title"> = {
    square: {
        mark: { anchor: "center", width: 0.4, x: 0.5, y: 0.3 },
        title: { align: "center", anchor: "center", size: 0.05, width: 0.9, x: 0.5, y: 0.6 },
    },
    wide: {
        mark: { anchor: "center", width: 0.2, x: 0.25, y: 0.5 },
        title: { anchor: "start", size: 0.07, width: 0.5, x: 0.4, y: 0.3 },
    },
};

describe("the expression vocabulary", () => {
    it("clamps and interpolates", () => {
        expect(clamp(2)).toBe(1);
        expect(clamp(-1)).toBe(0);
        expect(clamp(5, 0, 10)).toBe(5);
        expect(lerp(10, 20, 0.5)).toBe(15);
    });

    it("eases from zero to one on every curve", () => {
        const curves: readonly Curve[] = ["inCubic", "inOutCubic", "inOutSine", "linear", "outBack", "outCubic"];
        for (const curve of curves) {
            expect(ease(0, curve)).toBeCloseTo(0);
            expect(ease(1, curve)).toBeCloseTo(1);
        }
        expect(ease(0.5)).toBeCloseTo(0.5);
    });

    it("throws on a curve outside the vocabulary", () => {
        const [attempt] = ["bounce"].filter(isForgedCurve).map((curve) => () => ease(0.5, curve));
        expect(attempt).toThrow("bounce");
    });

    it("windows, waves and staggers progress", () => {
        expect(between(0.25, 0.5, 1)).toBe(0);
        expect(between(0.75, 0.5, 1)).toBe(0.5);
        expect(between(0.5, 0.5, 0.5)).toBe(1);
        expect(wave(0)).toBeCloseTo(0.5);
        expect(wave(0.25)).toBeCloseTo(1);
        expect(stagger(0.5, 1, 0.25, 0.5)).toBeCloseTo(0.5);
    });

    it("draws deterministic noise in the unit interval and formats pixels", () => {
        expect(noise(3, 1)).toBe(noise(3, 1));
        expect(noise(3, 1)).toBeGreaterThanOrEqual(0);
        expect(noise(3, 1)).toBeLessThan(1);
        expect(pixels(12)).toBe("12px");
    });

    it("reads a pixel length back to its number, and a keyword or an empty value as not a number", () => {
        expect(pixelValue("12.5px")).toBe(12.5);
        expect(pixelValue("40")).toBe(40);
        expect(pixelValue("normal")).toBeNaN();
        expect(pixelValue("")).toBeNaN();
    });
});

describe("the layout vocabulary", () => {
    it("reads a profile's orientation and the slot it selects", () => {
        expect(orientationOf(WIDE)).toBe("wide");
        expect(orientationOf(SQUARE)).toBe("square");
        expect(slotAt(LAYOUT, "mark", SQUARE).width).toBeCloseTo(0.4);
        expect(percent(25)).toBe("25%");
    });

    it("places a square slot so it stays square on any profile, with lift and growth applied", () => {
        const placement = placeAt(LAYOUT, "mark", { grow: () => 2, lift: (frame) => frame.progress, square: true });
        const lifted = frameOf(1200, 630, 0.1);
        expect(valueAt(placement.width ?? 0, lifted)).toBeCloseTo(0.4);
        expect(valueAt(placement.height ?? 0, lifted)).toBeCloseTo(squareHeight(0.4, lifted));
        expect(squareHeight(0.4, lifted) * 630).toBeCloseTo(0.4 * 1200);
        expect(valueAt(placement.y, lifted)).toBeCloseTo(0.6);
        expect(valueAt(placement.anchor ?? "start", SQUARE)).toBe("center");
    });

    it("sizes text from the profile width and aligns it by the slot, left by default", () => {
        expect(fontAt(LAYOUT, "title")(WIDE)).toBe("84px");
        expect(alignAt(LAYOUT, "title")(WIDE)).toBe("left");
        expect(alignAt(LAYOUT, "title")(SQUARE)).toBe("center");
    });
});
