import {
    ANIMATE_ATTRIBUTE,
    ANIMATE_DELAY_ATTRIBUTE,
    FADE_IN,
} from "@banes-lab/web/configuration/constants/element.constants.ts";
import { animated, contextOf, namedFor } from "@banes-lab/web/presentation/renderers/element.renderer.ts";
import { describe, expect, it } from "vitest";
import { TITLE_SEPARATOR } from "@banes-lab/web/configuration/strings/page.strings.ts";

const CLASS_NAME = "hero";
const DELAY = 120;

describe("animated", () => {
    it("stamps the effect and delay on the created element", () => {
        const element = animated("p", { className: CLASS_NAME }, FADE_IN, DELAY);
        expect(element.className).toBe(CLASS_NAME);
        expect(element.getAttribute(ANIMATE_ATTRIBUTE)).toBe(FADE_IN);
        expect(element.getAttribute(ANIMATE_DELAY_ATTRIBUTE)).toBe(String(DELAY));
    });

    it("defaults the delay to zero", () => {
        expect(animated("div", {}, FADE_IN).getAttribute(ANIMATE_DELAY_ATTRIBUTE)).toBe("0");
    });
});

describe("contextOf and namedFor", () => {
    it("adds the context a generic label needs, hidden from sight and joined for an accessible name", () => {
        const hidden = contextOf("Grammar");
        expect(hidden.tagName).toBe("SPAN");
        expect(hidden.className).toBe("visually-hidden");
        expect(hidden.textContent).toBe(`${TITLE_SEPARATOR}Grammar`);
        expect(namedFor("Start", "Grammar")).toBe(`Start${TITLE_SEPARATOR}Grammar`);
    });
});
