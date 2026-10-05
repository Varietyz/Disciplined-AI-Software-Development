import { describe, expect, it } from "vitest";
import { compressedLine } from "@banes-lab/build-scripts/configuration/strings/text.strings.ts";

describe("compressedLine", () => {
    it("names the compressed and the reused counts", () => {
        expect(compressedLine({ compressed: 4, reused: 9 })).toContain("for 4 changed text file(s) and reused 9");
    });
});
