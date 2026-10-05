import { describe, expect, it } from "vitest";
import { orthogonal, tracePoints } from "@banes-lab/web/domain/converters/learning.fragment.converter.ts";
import { LEARNING } from "@banes-lab/web/core/generated/learning.generated.ts";
import type { LearningPoint } from "@banes-lab/web/types/learning.types.ts";
import { gridFor } from "@banes-lab/web/domain/converters/learning.grid.converter.ts";
import { layoutLearning } from "@banes-lab/web/domain/converters/learning.converter.ts";
import { unfold } from "@banes-lab/web/domain/converters/learning.route.converter.ts";

const turnsBack = function turnsBack(before: LearningPoint, here: LearningPoint, after: LearningPoint): boolean {
    const level = before.y === here.y && here.y === after.y;
    const upright = before.x === here.x && here.x === after.x;
    const along = (here.x - before.x) * (after.x - here.x) + (here.y - before.y) * (after.y - here.y);
    return (level || upright) && along < 0;
};

describe("unfold", () => {
    it("leaves the home page's rail with no turn back over its own line", () => {
        const model = layoutLearning(LEARNING);
        const grid = gridFor(model);
        const stops = model.blocks.flatMap((block) => block.stops.map((stop) => ({ block, cx: stop.cx, cy: stop.cy })));
        const rail = unfold(orthogonal(grid, tracePoints(grid, stops)), stops);
        const back = rail.slice(1, -1).filter((here, index) => {
            const before = rail[index];
            const after = rail[index + 2];
            return before !== undefined && after !== undefined && turnsBack(before, here, after);
        });
        expect(back).toStrictEqual([]);
    });

    it("cuts a spur past a turn and keeps a stop the rail turns at", () => {
        const stops = [{ cx: 40, cy: 40 }];
        const spurred = [
            { x: 0, y: 0 },
            { x: 30, y: 0 },
            { x: 24, y: 0 },
            { x: 24, y: 50 },
        ];
        expect(unfold(spurred, stops)).toStrictEqual([
            { x: 0, y: 0 },
            { x: 24, y: 0 },
            { x: 24, y: 50 },
        ]);
        const atStop = [
            { x: 0, y: 40 },
            { x: 40, y: 40 },
            { x: 30, y: 40 },
        ];
        expect(unfold(atStop, stops)).toStrictEqual(atStop);
    });
});
