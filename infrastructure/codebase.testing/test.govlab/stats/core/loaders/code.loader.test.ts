import { BARE, IGNORE, INPUT } from "./stats.fixture.ts";
import { describe, expect, it } from "vitest";
import { ANALYSIS_SEARCH_DEPTH } from "@govlab/stats/configuration/constants/code.constants.ts";
import { TOP_MODULES } from "@govlab/stats/configuration/constants/metric.constants.ts";
import { collectAnalysis } from "@govlab/stats/core/loaders/code.loader.ts";

describe("collectAnalysis", () => {
    it("reports nothing analyzed when no code info folder exists", () => {
        const stats = collectAnalysis(BARE, IGNORE);
        expect(stats.modulesAnalyzed).toBe(0);
        expect(stats.topByDefinitions).toStrictEqual([]);
        expect(ANALYSIS_SEARCH_DEPTH).toBeGreaterThan(0);
    });

    it("keeps the resolution rate within its bounds and the top list within its cap", () => {
        expect(INPUT.analysis.resolutionRate).toBeGreaterThanOrEqual(0);
        expect(INPUT.analysis.resolutionRate).toBeLessThanOrEqual(1);
        expect(INPUT.analysis.topByDefinitions.length).toBeLessThanOrEqual(TOP_MODULES);
    });
});
