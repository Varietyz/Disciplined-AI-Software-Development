import { describe, expect, it } from "vitest";
import { platformCapabilities } from "@ssot/govlab/shared/manifests/capability.manifest.ts";

describe("platformCapabilities", () => {
    it("derives the capability set from the platform-side folders rather than a list", () => {
        const capabilities = platformCapabilities();
        expect(Array.isArray(capabilities)).toBe(true);
        expect(capabilities.every((entry) => entry.noun.length > 0 && entry.platformPath.length > 0)).toBe(true);
    });
});
