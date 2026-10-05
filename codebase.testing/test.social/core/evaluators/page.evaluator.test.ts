import type { ColumnEntry, ColumnSpec, FrameContext } from "@banes-lab/social-share/types/card.types.ts";
import { columnOf, wrapCount } from "@banes-lab/social-share/core/evaluators/page.evaluator.ts";
import { describe, expect, it } from "vitest";

const WIDE: FrameContext = { frame: 0, frames: 10, profile: { height: 600, id: "p", width: 1000 }, progress: 0, t: 0 };

const COLUMN: ColumnSpec = {
    align: "center",
    rows: {
        kicker: { gap: 0, leading: 1, size: 0.02 },
        rule: { gap: 0.05, leading: 1, size: 0.006, width: 0.2 },
        subtitle: { gap: 0.05, leading: 1.5, size: 0.02 },
        title: { gap: 0.02, leading: 1, size: 0.05 },
    },
    width: 0.6,
    x: 0.2,
    y: 0.5,
};

describe("wrapCount", () => {
    it("counts the lines a monospace text wraps to at a column count", () => {
        expect(wrapCount("one two three", 20)).toBe(1);
        expect(wrapCount("one two three", 7)).toBe(2);
        expect(wrapCount("one two three", 3)).toBe(3);
        expect(wrapCount("unbreakable", 4)).toBe(1);
        expect(wrapCount("", 0)).toBe(1);
    });
});

describe("columnOf", () => {
    it("stacks the rows downward, centers the block on the column's anchor and centers narrow rows", () => {
        const entries: readonly ColumnEntry[] = [
            { row: "title", text: "A title" },
            { row: "subtitle", text: "A tagline" },
            { row: "rule", text: "" },
        ];
        const boxes = columnOf(COLUMN, entries, WIDE);
        const title = boxes.get("title");
        const subtitle = boxes.get("subtitle");
        const rule = boxes.get("rule");
        expect(title?.height).toBeCloseTo(50 / 600);
        expect(subtitle?.y).toBeCloseTo((title?.y ?? 0) + (title?.height ?? 0) + 0.05);
        expect(rule?.x).toBeCloseTo(0.4);
        expect(rule?.height).toBeCloseTo(6 / 600);
        const bottom = (rule?.y ?? 0) + (rule?.height ?? 0);
        expect(((title?.y ?? 0) + bottom) / 2).toBeCloseTo(0.5);
        expect(boxes.has("kicker")).toBe(false);
    });

    it("grows a title that wraps and places a left-aligned column at its own edge", () => {
        const narrow = { ...COLUMN, align: "left" as const, width: 0.1 };
        const boxes = columnOf(narrow, [{ row: "title", text: "A long wrapping title" }], WIDE);
        expect(boxes.get("title")?.height).toBeGreaterThan(50 / 600);
        expect(boxes.get("title")?.x).toBeCloseTo(0.2);
        const right = columnOf({ ...COLUMN, align: "right" }, [{ row: "rule", text: "" }], WIDE);
        expect(right.get("rule")?.x).toBeCloseTo(0.6);
    });
});
