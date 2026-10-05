import {
    BADGE_LOGO,
    GRAMMAR_EMBLEM,
    GRAMMAR_MARK,
    LICENSE_BY,
    LICENSE_CC,
    LICENSE_SA,
    SITE_LOGO,
} from "@banes-lab/web/core/assets/image.assets.ts";
import { describe, expect, it } from "vitest";

const LOCATIONS = [BADGE_LOGO, GRAMMAR_EMBLEM, GRAMMAR_MARK, LICENSE_BY, LICENSE_CC, LICENSE_SA, SITE_LOGO];

describe("the image asset catalog", () => {
    it("roots every image at one served asset location", () => {
        const [root] = LOCATIONS.map((location) => location.slice(0, location.indexOf("/", 1) + 1));
        expect(LOCATIONS.every((location) => location.startsWith(root ?? ""))).toBe(true);
    });

    it("names the site logo the deploy member embeds in its notifications", () => {
        expect(SITE_LOGO.endsWith(".webp")).toBe(true);
    });
});
