import { describe, expect, it } from "vitest";
import { relationOf, singleRelation } from "@banes-lab/build-scripts/core/factories/reference.factory.ts";

const EDGE = { label: "Loop", ref: "reasoning:loop" };

describe("relationOf and singleRelation", () => {
    it("build one relation from the edges given, and none from no edge", () => {
        expect(relationOf("requires", [EDGE])).toStrictEqual([{ edges: [EDGE], relation: "requires" }]);
        expect(relationOf("requires", [])).toStrictEqual([]);
        expect(singleRelation("contract", EDGE)).toStrictEqual([{ edges: [EDGE], relation: "contract" }]);
        expect(singleRelation("contract", null)).toStrictEqual([]);
    });
});
