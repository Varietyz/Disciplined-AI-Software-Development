import { describe, expect, it } from "vitest";
import { duplicateDetector, missingDetectors } from "@ssot/secrets/configuration/strings/detector.strings.ts";

describe("detector strings", () => {
    it("name the kind a registration repeats, and the kinds no file registers", () => {
        expect(duplicateDetector("jwt")).toContain("jwt");
        expect(missingDetectors(["jwt", "ssh"])).toContain("jwt, ssh");
    });
});
