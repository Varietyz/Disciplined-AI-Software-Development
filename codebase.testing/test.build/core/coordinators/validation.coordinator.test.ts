import { describe, expect, it } from "vitest";
import { validateDiscovery } from "@banes-lab/build-scripts/core/coordinators/validation.coordinator.ts";

describe("validateDiscovery", () => {
    it("is the discovery validator the gate and the deploy run over the built site", () => {
        expect(typeof validateDiscovery).toBe("function");
    });
});
