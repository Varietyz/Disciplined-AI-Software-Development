import { BARE, INPUT } from "../loaders/stats.fixture.ts";
import { describe, expect, it } from "vitest";
import { TOP_PACKAGES } from "@govlab/stats/configuration/constants/metric.constants.ts";
import { collectDependencyGraph } from "@govlab/stats/core/analyzers/dependency.analyzer.ts";

describe("collectDependencyGraph", () => {
    it("finds the workspace packages and their internal edges", () => {
        expect(INPUT.graph.nodeCount).toBeGreaterThan(0);
        expect(INPUT.graph.links.length).toBeLessThanOrEqual(INPUT.graph.nodeCount);
        expect(INPUT.graph.isolated).toBe(INPUT.graph.nodeCount - INPUT.graph.links.length);
        expect(INPUT.graph.topFanIn.length).toBeLessThanOrEqual(TOP_PACKAGES);
    });

    it("reports an empty graph for a root with no workspace manifest", () => {
        const graph = collectDependencyGraph(BARE);
        expect(graph.nodeCount).toBe(0);
        expect(graph.edges).toBe(0);
    });
});
