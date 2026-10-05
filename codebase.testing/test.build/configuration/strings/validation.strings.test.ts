import { describe, expect, it } from "vitest";
import { discoveryFindingsHeading } from "@banes-lab/build-scripts/configuration/strings/validation.strings.ts";

describe("discoveryFindingsHeading", () => {
    it("heads the discovery report with its finding count", () => {
        expect(discoveryFindingsHeading(2)).toBe("[discovery] 2 finding(s):");
    });
});
