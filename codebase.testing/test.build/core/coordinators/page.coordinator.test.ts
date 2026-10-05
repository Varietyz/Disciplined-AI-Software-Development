import { describe, expect, it } from "vitest";
import { prerenderSite } from "@banes-lab/build-scripts/core/coordinators/page.coordinator.ts";

describe("prerenderSite", () => {
    it("is the build-time entry the plugin drives after the bundle closes", () => {
        expect(typeof prerenderSite).toBe("function");
    });
});
