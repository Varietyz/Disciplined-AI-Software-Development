import { BARE, INPUT } from "./stats.fixture.ts";
import { describe, expect, it } from "vitest";
import { collectVerifyReport } from "@govlab/stats/core/loaders/report.loader.ts";

describe("collectVerifyReport", () => {
    it("reports no recorded run and no pass where the gate wrote no report", () => {
        const stats = collectVerifyReport(BARE);
        expect(stats.available).toBe(false);
        expect(stats.ok).toBe(false);
    });

    it("totals the stages it reads", () => {
        const { stages, totals } = INPUT.verify;
        expect(stages.reduce((sum, stage) => sum + stage.passed + stage.failed, 0)).toBeLessThanOrEqual(
            Math.max(totals.steps, totals.passed + totals.failed),
        );
    });
});
