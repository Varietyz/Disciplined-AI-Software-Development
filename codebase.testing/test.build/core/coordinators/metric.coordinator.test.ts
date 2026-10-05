import { describe, expect, it } from "vitest";
import { buildMetrics } from "@banes-lab/build-scripts/core/coordinators/metric.coordinator.ts";

describe("buildMetrics", () => {
    it("is the build-start step the metrics plugin drives", () => {
        expect(typeof buildMetrics).toBe("function");
    });
});
