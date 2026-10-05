import { FONT_ROUTE, SUBSET_FILE } from "@banes-lab/build-scripts/configuration/constants/icons.constants.ts";
import { describe, expect, it } from "vitest";
import {
    glyphTextOf,
    renderGlyphs,
    renderStylesheet,
} from "@banes-lab/build-scripts/core/formatters/icons.formatter.ts";

const ICON_PREFIX = "bi-";
const SWAP = "font-display: swap;";
const UNKNOWN = "no-such-glyph-anywhere";

describe("renderStylesheet", () => {
    it("declares the swapped face once and one glyph rule per name, nothing else", () => {
        const css = renderStylesheet(["x", "check2"]);
        expect(css.split(SWAP)).toHaveLength(2);
        expect(css).toContain(`${FONT_ROUTE}${SUBSET_FILE}`);
        expect(css).toContain(`.${ICON_PREFIX}x::before`);
        expect(css).toContain(`.${ICON_PREFIX}check2::before`);
        expect(css.split("::before {")).toHaveLength(4);
    });

    it("refuses a name the icon font has no glyph for", () => {
        expect(() => renderStylesheet([UNKNOWN])).toThrow(UNKNOWN);
    });
});

describe("glyphTextOf and renderGlyphs", () => {
    it("spells one character per declared icon and refuses an unknown one", () => {
        const glyphs = new Intl.Segmenter().segment(glyphTextOf(["x", "check2"]));
        expect([...glyphs]).toHaveLength(2);
        expect(() => glyphTextOf([UNKNOWN])).toThrow(UNKNOWN);
    });

    it("maps each prefixed icon name to the same character the subset font carries", () => {
        const module = renderGlyphs(["x"]);
        expect(module).toContain(`["${ICON_PREFIX}x", ${JSON.stringify(glyphTextOf(["x"]))}]`);
        expect(module.startsWith("export const ICON_GLYPHS")).toBe(true);
    });
});
