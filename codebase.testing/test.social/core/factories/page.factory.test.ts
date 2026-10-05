import { FAQ_ACCENT, HOME_ACCENT } from "@banes-lab/web/configuration/constants/page.constants.ts";
import { FAQ_PAGE, HOME_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { FAQ_SHARE, HOME_SHARE, SITE_NAME } from "@banes-lab/web/configuration/strings/page.strings.ts";
import { describe, expect, it } from "vitest";
import type { CardSpec } from "@banes-lab/social-share/types/card.types.ts";
import { PROFILES } from "@banes-lab/social-share/configuration/configs/card.config.ts";
import { SITE_HOST } from "@banes-lab/social-share/configuration/data/site.data.ts";
import { UNKNOWN_PAGE_ENTRY } from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import { createPageCard } from "@banes-lab/social-share/core/factories/page.factory.ts";
import { fieldLayers } from "@banes-lab/social-share/core/factories/field.factory.ts";
import { pageAddress } from "@banes-lab/social-share/core/evaluators/page.evaluator.ts";
import { resolveCard } from "@banes-lab/social-share/core/evaluators/card.evaluator.ts";

const textsOf = function textsOf(spec: CardSpec): readonly string[] {
    const [profile] = PROFILES;
    if (profile === undefined) {
        throw new Error("the output config defines no profile");
    }
    return resolveCard(spec, profile, spec.timeline.keyFrame)
        .layers.filter((layer) => layer.kind === "text")
        .map((layer) => layer.content);
};

describe("createPageCard", () => {
    it("builds a page's card in its tone with its headline, tagline, the site name and the domain", () => {
        const spec = createPageCard({ id: "faq", page: FAQ_PAGE });
        expect(spec.page).toBe(FAQ_PAGE);
        expect(spec.tone).toBe(FAQ_ACCENT);
        expect(spec.alt).toContain(FAQ_SHARE.headline);
        expect(textsOf(spec)).toEqual(
            expect.arrayContaining([FAQ_SHARE.headline, FAQ_SHARE.tagline, SITE_NAME, pageAddress(FAQ_PAGE)]),
        );
        expect(pageAddress(FAQ_PAGE)).toBe(`${SITE_HOST}/${FAQ_PAGE}`);
        expect(pageAddress(HOME_PAGE)).toBe(SITE_HOST);
        expect(spec.timeline.frames).toBeGreaterThan(1);
    });

    it("drops the site-name kicker when the headline already is the site name, and takes a custom mark and field", () => {
        const spec = createPageCard({
            field: [{ id: "field", kind: "box", placement: { x: 0, y: 0 } }],
            id: "home",
            mark: { alt: "Mark", id: "mark", kind: "image", placement: { x: 0, y: 0 }, source: "/mark.png" },
            page: HOME_PAGE,
            stylesheet: ".extra {}",
        });
        expect(spec.tone).toBe(HOME_ACCENT);
        expect(spec.layers.some((layer) => layer.id === "kicker")).toBe(false);
        expect(spec.layers.filter((layer) => layer.id === "field")).toHaveLength(1);
        expect(spec.layers.some((layer) => layer.id === "ground")).toBe(false);
        expect(spec.layers.find((layer) => layer.id === "mark")?.kind).toBe("image");
        expect(spec.stylesheet.endsWith(".extra {}")).toBe(true);
        expect(textsOf(spec)).toContain(HOME_SHARE.tagline);
    });

    it("refuses a page the site does not register", () => {
        expect(() => createPageCard({ id: "stray", page: "nowhere" })).toThrow(UNKNOWN_PAGE_ENTRY);
    });
});

describe("fieldLayers", () => {
    it("lays the ground and the moving pools unless a card brings its own field", () => {
        const layers = fieldLayers();
        expect(layers[0]?.id).toBe("ground");
        expect(layers.filter((layer) => layer.id.startsWith("pool-")).length).toBeGreaterThan(0);
        expect(
            fieldLayers([{ id: "own", kind: "box", placement: { x: 0, y: 0 } }]).map((layer) => layer.id),
        ).toStrictEqual(["own"]);
    });
});
