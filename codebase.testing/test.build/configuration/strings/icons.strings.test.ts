import { describe, expect, it } from "vitest";
import { iconsLine, unknownGlyph } from "@banes-lab/build-scripts/configuration/strings/icons.strings.ts";

describe("iconsLine and unknownGlyph", () => {
    it("report the glyphs written, and name an icon the font does not carry", () => {
        expect(iconsLine(3, "icon.tokens.css")).toBe("icons: wrote 3 glyph(s) into icon.tokens.css\n");
        expect(unknownGlyph("bi-nowhere")).toContain('"bi-nowhere" names no glyph');
    });
});
