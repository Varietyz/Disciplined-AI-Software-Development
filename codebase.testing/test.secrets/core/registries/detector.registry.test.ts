import { defineDetector, registeredDetectors } from "@ssot/secrets/core/registries/detector.registry.ts";
import { describe, expect, it } from "vitest";
import { duplicateDetector } from "@ssot/secrets/configuration/strings/detector.strings.ts";

describe("defineDetector", () => {
    it("registers a kind once and refuses a second registration of it", () => {
        const before = registeredDetectors().length;
        defineDetector({ detects: () => false, kind: "address" });
        expect(registeredDetectors()).toHaveLength(before + 1);
        expect(() => defineDetector({ detects: () => false, kind: "address" })).toThrow(duplicateDetector("address"));
    });
});
