import { describe, expect, it } from "vitest";
import type { WalkNode } from "@govlab/patterns/types/walk.types.ts";
import { hardenIssues } from "@govlab/patterns/core/validators/markup.validator.ts";
import { renderHexGrid } from "@govlab/patterns/core/renderers/walk.renderer.ts";

const LONG = 13;

const walk = function walk(length: number): WalkNode[] {
    return Array.from({ length }, (_, index) => ({
        depth: index % 2,
        label: index === 1 ? "call_expression" : "node",
        role: "node",
    }));
};

const countHexes = function countHexes(svg: string): number {
    return svg.split('<polygon class="hex ').length - 1;
};

describe("renderHexGrid", () => {
    it("draws one hardened hex per step with a ref, a state class and the flow path", () => {
        const svg = renderHexGrid(walk(LONG), { title: "example.ts" });
        expect(countHexes(svg)).toBe(LONG);
        expect(svg).toContain('data-ref="0"');
        expect(svg).toContain("hex-call");
        expect(svg).toContain('<polyline class="hex-path"');
        expect(svg).toContain('class="hex-arrow"');
        expect(hardenIssues(svg)).toStrictEqual([]);
    });

    it("carries no color or title in the vector", () => {
        const svg = renderHexGrid(walk(LONG));
        expect(svg).not.toContain("fill=");
        expect(svg).not.toContain("<title>");
    });

    it("marks a flagged cell with its severity class and a warn mark", () => {
        const flagged = renderHexGrid([{ depth: 0, file: "a.ts", label: "node", name: "run", role: "node" }], {
            flagged: new Map([["a.ts::run", "high"]]),
        });
        expect(flagged).toContain("hex-flagged-high");
        expect(flagged).toContain('class="hex-warn hex-warn-high"');
    });

    it("degrades to a labeled empty vector when there is no code", () => {
        const svg = renderHexGrid([], { title: "empty" });
        expect(svg).toContain("empty: no code");
        expect(countHexes(svg)).toBe(0);
    });
});
