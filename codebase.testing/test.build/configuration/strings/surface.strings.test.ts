import { describe, expect, it } from "vitest";
import {
    scriptMissing,
    slotsUnreadable,
    stepFailed,
    surfacesLine,
    venueMissing,
    waitUnresolved,
} from "@banes-lab/build-scripts/configuration/strings/surface.strings.ts";

describe("the surface recorder lines", () => {
    it("say whether the figures were recorded or reused, and where", () => {
        expect(surfacesLine(2, false, "surfaces")).toBe("surfaces: recorded 2 figure(s) into surfaces\n");
        expect(surfacesLine(2, true, "surfaces")).toContain("reused 2 figure(s) in surfaces");
    });

    it("name the command, the expected exit and the missing piece of a failed recording", () => {
        expect(stepFailed("npm run raise", 0, 1, "trace")).toContain("exited 1, and the scenario expects 0");
        expect(waitUnresolved("npm run await")).toContain("did not return after the next write");
        expect(venueMissing()).toContain("created no venue file");
        expect(slotsUnreadable()).toContain("exports no slotText function");
        expect(scriptMissing("raise")).toContain("declares no `raise` script");
    });
});
