import { clickedLine, logWritten, shotWritten } from "@project/scripts/configuration/strings/snapshot.strings.ts";
import { describe, expect, it } from "vitest";

describe("the snapshot's lines", () => {
    it("name the click, the console log and the screenshot they report", () => {
        expect(clickedLine(3, 4)).toBe("snapshot: clicked 3,4\n");
        expect(logWritten("c.log", 2)).toBe("snapshot: wrote c.log (2 console records)\n");
        expect(shotWritten("s.png")).toBe("snapshot: wrote s.png\n");
    });
});
