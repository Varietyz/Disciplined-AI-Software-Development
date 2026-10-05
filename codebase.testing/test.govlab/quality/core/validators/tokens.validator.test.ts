import { describe, expect, it } from "vitest";
import { validateWith } from "./validation.fixture.ts";

const RULE = "css-variable-location";

describe("the css-variable-location validator", () => {
    it("flags a var defined outside config files with no base definition", () => {
        const found = validateWith(RULE, [
            ["components/card.css", ".c{--local-only:2}"],
            ["styles/variables.css", ":root{--brand:#fff}"],
        ]);
        expect(found).toHaveLength(1);
        expect(found[0]?.file).toBe("components/card.css");
        expect(found[0]?.message).toContain("--local-only");
    });

    it("allows a component to override a base token (defined in config)", () => {
        const found = validateWith(RULE, [
            ["components/card.css", ".dark{--brand:#000}"],
            ["styles/theme.css", ":root{--brand:#fff}"],
        ]);
        expect(found).toEqual([]);
    });

    it("recognizes tokens.css as a token-definition file", () => {
        expect(validateWith(RULE, [["styles/tokens.css", ":root{--brand:#fff}"]])).toEqual([]);
    });

    it("recognizes the styles/globals layer as token-definition files", () => {
        expect(validateWith(RULE, [["styles/globals/tones.css", ":root{--c-bg:#111}"]])).toEqual([]);
    });
});
