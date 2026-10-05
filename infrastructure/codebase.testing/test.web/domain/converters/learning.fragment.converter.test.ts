import { describe, expect, it } from "vitest";
import { orthogonal, tracePoints } from "@banes-lab/web/domain/converters/learning.fragment.converter.ts";
import type { LaidBlock } from "@banes-lab/web/types/learning.types.ts";
import { gridFor } from "@banes-lab/web/domain/converters/learning.grid.converter.ts";
import { layoutLearning } from "@banes-lab/web/domain/converters/learning.converter.ts";

const MODEL = layoutLearning([
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
        stops: [{ id: "ab3", label: "01 - Instruction patterns", path: "/pag/patterns", requires: [] }],
    },
]);

const walkers = function walkers(): readonly { block: LaidBlock; cx: number; cy: number }[] {
    return MODEL.blocks.flatMap((block) => block.stops.map((stop) => ({ block, cx: stop.cx, cy: stop.cy })));
};

describe("tracePoints", () => {
    it("visits every stop in order", () => {
        const stops = walkers();
        const points = tracePoints(gridFor(MODEL), stops);
        for (const stop of stops) {
            expect(points.some((point) => point.x === stop.cx && point.y === stop.cy)).toBe(true);
        }
    });

    it("threads extra points between blocks rather than jumping straight across", () => {
        const stops = walkers();
        expect(tracePoints(gridFor(MODEL), stops).length).toBeGreaterThan(stops.length);
    });
});

describe("orthogonal", () => {
    it("leaves only horizontal or vertical segments between consecutive points", () => {
        const grid = gridFor(MODEL);
        const straight = orthogonal(grid, tracePoints(grid, walkers()));
        for (let index = 1; index < straight.length; index += 1) {
            const before = straight[index - 1];
            const here = straight[index];
            expect(before?.x === here?.x || before?.y === here?.y).toBe(true);
        }
    });

    it("answers with nothing for an empty run", () => {
        expect(orthogonal(gridFor(MODEL), [])).toStrictEqual([]);
    });
});
