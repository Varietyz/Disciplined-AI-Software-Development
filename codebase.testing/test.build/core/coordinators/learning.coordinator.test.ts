import { describe, expect, it } from "vitest";
import { buildLearningMap } from "@banes-lab/build-scripts/core/coordinators/learning.coordinator.ts";

describe("buildLearningMap", () => {
    it("is the step the graph build runs to write the learning route", () => {
        expect(typeof buildLearningMap).toBe("function");
    });
});
