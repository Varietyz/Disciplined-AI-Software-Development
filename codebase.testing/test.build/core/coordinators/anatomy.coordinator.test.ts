import { buildAnatomy, deriveAnatomy } from "@banes-lab/build-scripts/core/coordinators/anatomy.coordinator.ts";
import { describe, expect, it } from "vitest";
import { chartsOf } from "@banes-lab/build-scripts/core/converters/figure.converter.ts";

describe("buildAnatomy and deriveAnatomy", () => {
    it("expose the derivation the build config runs before it resolves", () => {
        expect(typeof buildAnatomy).toBe("function");
        expect(typeof deriveAnatomy).toBe("function");
        expect(typeof chartsOf).toBe("function");
    });
});
