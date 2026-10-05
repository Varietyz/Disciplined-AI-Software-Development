import { describe, expect, it } from "vitest";
import type { WalkNode } from "@govlab/patterns/types/walk.types.ts";
import { walkGrid } from "@govlab/patterns/core/resolvers/walk.resolver.ts";

const LONG = 200;
const DEPTHS = 4;

const node = function node(depth: number, label: string): WalkNode {
    return { depth, label, role: "node" };
};

describe("walkGrid", () => {
    it("places the first node at the origin and one cell per node", () => {
        const cells = walkGrid([node(0, "a"), node(1, "b"), node(1, "c")]);
        expect(cells.map((cell) => cell.node.label)).toStrictEqual(["a", "b", "c"]);
        expect(cells[0]?.at).toStrictEqual({ q: 0, r: 0 });
    });

    it("never places two nodes on one cell, even on a long walk", () => {
        const cells = walkGrid(Array.from({ length: LONG }, (_, index) => node(index % DEPTHS, "n")));
        expect(new Set(cells.map((cell) => `${cell.at.q},${cell.at.r}`)).size).toBe(LONG);
    });

    it("takes a node's declared state before classifying its label", () => {
        const [cell] = walkGrid([{ ...node(0, "call_expression"), state: "declare" }]);
        expect(cell?.state).toBe("declare");
        expect(walkGrid([])).toStrictEqual([]);
    });
});
