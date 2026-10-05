import { assemble, feed } from "@govlab/patterns/core/coordinators/field.coordinator.ts";
import { describe, expect, it } from "vitest";
import { SOURCE_ID } from "@govlab/patterns/configuration/constants/graph.constants.ts";
import { buildAnalyzers } from "@govlab/patterns/core/factories/field.factory.ts";

describe("the field coordinator", () => {
    it("feeds every analyzer and assembles one source node ahead of their output", () => {
        const analyzers = buildAnalyzers(new Map([["color", ["distribution"]]]));
        feed(analyzers, [{ color: "red" }, { color: "blue" }]);
        const { nodes, findings } = assemble(analyzers);
        expect(nodes[0]?.id).toBe(SOURCE_ID);
        expect(findings.length).toBeGreaterThan(0);
    });

    it("assembles only the source node when no analyzer exists", () => {
        expect(assemble(new Map()).nodes.map((node) => node.id)).toStrictEqual([SOURCE_ID]);
    });
});
