import {
    cellAt,
    gridFor,
    isSolid,
    searchGrid,
    walkBack,
} from "@banes-lab/web/domain/converters/learning.grid.converter.ts";
import { describe, expect, it } from "vitest";
import type { LearningModel } from "@banes-lab/web/types/learning.types.ts";

const MODEL: LearningModel = {
    blocks: [
        {
            accent: "page-gold",
            code: "aa",
            cx: 60,
            cy: 60,
            height: 40,
            icon: "bi-cpu",
            label: "Start",
            owner: "disciplined-methodology",
            stops: [],
            width: 40,
            x: 40,
            y: 40,
        },
    ],
    height: 240,
    width: 240,
};

describe("gridFor", () => {
    it("sizes the grid from the model and marks the block's cells solid", () => {
        const grid = gridFor(MODEL);
        expect(grid.wide).toBeGreaterThan(0);
        expect(grid.tall).toBeGreaterThan(0);
        expect(grid.blocked).toHaveLength(grid.wide * grid.tall);
        expect(grid.taken).toHaveLength(grid.wide * grid.tall);
        expect(isSolid(grid, { x: 60, y: 60 })).toBe(true);
    });
});

describe("isSolid", () => {
    it("treats open space as passable and anything outside the grid as solid", () => {
        const grid = gridFor(MODEL);
        expect(isSolid(grid, { x: 200, y: 200 })).toBe(false);
        expect(isSolid(grid, { x: -20, y: 0 })).toBe(true);
        expect(isSolid(grid, { x: 0, y: 100_000 })).toBe(true);
    });
});

describe("cellAt", () => {
    it("maps a point to its row-major cell index", () => {
        const grid = gridFor(MODEL);
        expect(cellAt(grid, { x: 0, y: 0 })).toBe(0);
        expect(cellAt(grid, { x: 200, y: 0 })).toBeGreaterThan(0);
    });
});

describe("searchGrid", () => {
    it("reaches the goal through open space and records where each cell came from", () => {
        const grid = gridFor(MODEL);
        const start = cellAt(grid, { x: 200, y: 200 });
        const goal = cellAt(grid, { x: 200, y: 120 });
        const came = searchGrid(grid, start, goal);
        expect(came[goal]).not.toBe(-1);
    });
});

describe("walkBack", () => {
    it("returns the path from start to goal in order and marks it taken", () => {
        const grid = gridFor(MODEL);
        const start = cellAt(grid, { x: 200, y: 200 });
        const goal = cellAt(grid, { x: 200, y: 120 });
        const walked = walkBack(grid, searchGrid(grid, start, goal), start, goal);
        expect(walked.at(0)).toBe(start);
        expect(walked.at(-1)).toBe(goal);
        expect(grid.taken[goal]).toBe(1);
    });
});
