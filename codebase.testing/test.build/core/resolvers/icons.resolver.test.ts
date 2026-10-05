import { codepointOf, fontSource } from "@banes-lab/build-scripts/core/resolvers/icons.resolver.ts";
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";

describe("codepointOf", () => {
    it("reads a glyph's codepoint from the icon font and refuses a name the font lacks", () => {
        expect(codepointOf("x")).toBeGreaterThan(0);
        expect(() => codepointOf("no-such-glyph-anywhere")).toThrow("no-such-glyph-anywhere");
    });
});

describe("fontSource", () => {
    it("points at the icon font file the package ships", () => {
        const file = fontSource();
        expect(file.endsWith(".woff2")).toBe(true);
        expect(existsSync(file)).toBe(true);
    });
});
