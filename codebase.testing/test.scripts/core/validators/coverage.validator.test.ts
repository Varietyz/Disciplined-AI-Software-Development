import {
    belowFloor,
    failuresFound,
    floorHeld,
    reportMissing,
} from "@project/scripts/configuration/strings/coverage.strings.ts";
import { describe, expect, it } from "vitest";
import { floorVerdict } from "@project/scripts/core/validators/coverage.validator.ts";

describe("floorVerdict", () => {
    it("holds when nothing failed and the passing count reaches the floor", () => {
        expect(floorVerdict({ numFailedTests: 0, numPassedTests: 10, numTotalTests: 10 }, 10)).toStrictEqual({
            held: true,
            text: floorHeld(10, 10),
        });
    });

    it("fails on any failed test before it looks at the floor", () => {
        expect(floorVerdict({ numFailedTests: 2, numPassedTests: 99 }, 10)).toStrictEqual({
            held: false,
            text: failuresFound(2),
        });
    });

    it("fails below the floor, and reads a report with no counts as zero passing", () => {
        expect(floorVerdict({ numFailedTests: 0, numPassedTests: 3, numTotalTests: 4 }, 10).text).toBe(
            belowFloor(3, 4, 10),
        );
        expect(floorVerdict(null, 1).held).toBe(false);
    });

    it("names the missing report", () => {
        expect(reportMissing("report.json")).toContain("report.json is missing");
    });
});
