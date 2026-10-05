import { BARE, INPUT } from "./stats.fixture.ts";
import { describe, expect, it } from "vitest";
import { collectQuality } from "@govlab/stats/core/loaders/catalog.loader.ts";

describe("collectQuality", () => {
    it("reads the catalog that the workspace ships", () => {
        expect(INPUT.quality.available).toBe(true);
        expect(INPUT.quality.totalRules).toBeGreaterThan(0);
        expect(INPUT.quality.byTool.size).toBeGreaterThan(0);
        expect(INPUT.quality.concepts).toBeGreaterThan(0);
    });

    it("reports unavailable, and still names its producer, when no catalog is there", () => {
        const stats = collectQuality(BARE);
        expect(stats.available).toBe(false);
        expect(stats.totalRules).toBe(0);
        expect(stats.producer.length).toBeGreaterThan(0);
    });
});
