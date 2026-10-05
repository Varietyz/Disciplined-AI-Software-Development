import { describe, expect, it } from "vitest";
import { memberMissing } from "@banes-lab/build-scripts/configuration/strings/coordination.strings.ts";

describe("memberMissing", () => {
    it("names the member folder that does not exist", () => {
        expect(memberMissing("probe")).toContain("the member probe does not exist");
    });
});
