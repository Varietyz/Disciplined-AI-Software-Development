import { BARE, INPUT } from "../loaders/stats.fixture.ts";
import { LOCAL_PREFIX, SAMPLE_SEGMENTS } from "@govlab/stats/configuration/constants/rule.constants.ts";
import { describe, expect, it } from "vitest";
import {
    jscpdConfiguration,
    knipConfiguration,
    oxlintConfiguration,
    prettierConfiguration,
} from "@govlab/stats/configuration/strings/rule.strings.ts";
import { collectActiveRules } from "@govlab/stats/core/analyzers/rule.analyzer.ts";

describe("collectActiveRules", () => {
    it("reads the rules and ecosystems the workspace activates", () => {
        expect(INPUT.activeRules.available).toBe(true);
        expect(INPUT.activeRules.byTool.size).toBeGreaterThan(0);
        expect(INPUT.activeRules.activeEcosystems.length).toBeGreaterThan(0);
        expect(INPUT.activeRules.local.active).toBeGreaterThan(0);
        expect(LOCAL_PREFIX.endsWith("/")).toBe(true);
        expect(SAMPLE_SEGMENTS.length).toBeGreaterThan(0);
    });

    it("names a reason exactly when it reports the rules unavailable", async () => {
        const stats = await collectActiveRules(BARE);
        expect(stats.available).toBe(stats.reason.length === 0);
    });
});

describe("the configuration descriptions", () => {
    it("carry every number they are given", () => {
        expect(oxlintConfiguration(2, 3)).toContain("2 categories");
        expect(jscpdConfiguration(1, 50, 5)).toContain("minTokens 50");
        expect(knipConfiguration(4, 1)).toContain("4 workspaces");
        expect(prettierConfiguration(6, 1, 120)).toContain("printWidth 120");
    });
});
