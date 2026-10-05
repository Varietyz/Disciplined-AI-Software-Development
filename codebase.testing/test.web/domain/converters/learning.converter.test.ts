import { describe, expect, it } from "vitest";
import { layoutLearning, widthOf } from "@banes-lab/web/domain/converters/learning.converter.ts";
import type { LearningBlock } from "@banes-lab/web/types/learning.types.ts";

const BLOCKS: readonly LearningBlock[] = [
    {
        code: "aa",
        label: "Start",
        owner: "disciplined-methodology",
        stops: [
            { id: "aa1", label: "01 - The loop", path: "/disciplined-methodology", requires: [] },
            { id: "aa2", label: "02 - Who does what", path: "/disciplined-methodology#who", requires: [] },
        ],
    },
    {
        code: "ab",
        label: "Patterns",
        owner: "pag",
        stops: [{ id: "ab3", label: "01 - Instruction patterns", path: "/pag/patterns", requires: ["aa1"] }],
    },
];

describe("widthOf", () => {
    it("measures the widest row", () => {
        expect(widthOf(["ab", "abcd"])).toBeGreaterThan(widthOf(["ab"]));
        expect(widthOf([])).toBe(0);
    });
});

describe("layoutLearning", () => {
    it("places every block and every stop inside the model bounds", () => {
        const model = layoutLearning(BLOCKS);
        expect(model.blocks).toHaveLength(BLOCKS.length);
        expect(model.width).toBeGreaterThan(0);
        expect(model.height).toBeGreaterThan(0);
        for (const block of model.blocks) {
            expect(block.x).toBeGreaterThanOrEqual(0);
            expect(block.y).toBeGreaterThanOrEqual(0);
            expect(block.x + block.width).toBeLessThanOrEqual(model.width);
            expect(block.y + block.height).toBeLessThanOrEqual(model.height);
        }
    });

    it("carries each stop's route and gives every stop in a block one width", () => {
        const [first] = layoutLearning(BLOCKS).blocks;
        expect(first?.stops.map((stop) => stop.path)).toStrictEqual([
            "/disciplined-methodology",
            "/disciplined-methodology#who",
        ]);
        expect(new Set(first?.stops.map((stop) => stop.width)).size).toBe(1);
    });

    it("carries each stop's prerequisites through the layout", () => {
        const [, second] = layoutLearning(BLOCKS).blocks;
        expect(second?.stops[0]?.requires).toStrictEqual(["aa1"]);
    });

    it("resolves each block's accent from the page it belongs to", () => {
        const accents = layoutLearning(BLOCKS).blocks.map((block) => block.accent);
        expect(new Set(accents).size).toBe(2);
    });

    it("stacks the stops of a block in order without overlap", () => {
        const [first] = layoutLearning(BLOCKS).blocks;
        const stops = first?.stops ?? [];
        for (let index = 1; index < stops.length; index += 1) {
            const before = stops[index - 1];
            const here = stops[index];
            expect(here?.y).toBeGreaterThanOrEqual((before?.y ?? 0) + (before?.height ?? 0));
        }
    });
});
