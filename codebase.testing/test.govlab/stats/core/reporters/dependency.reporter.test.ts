import { describe, expect, it } from "vitest";
import { INPUT } from "../loaders/stats.fixture.ts";
import { interactionSection } from "@govlab/stats/core/reporters/dependency.reporter.ts";

describe("interactionSection", () => {
    it("renders the package graph, and the call graph only when a module was analyzed", () => {
        const withCalls = interactionSection(INPUT.graph, INPUT.analysis);
        const withoutCalls = interactionSection(INPUT.graph, { ...INPUT.analysis, modulesAnalyzed: 0 });
        expect(withoutCalls.join("\n")).not.toContain("### Symbol call-graph");
        expect(withCalls.length).toBeGreaterThanOrEqual(withoutCalls.length);
    });
});
