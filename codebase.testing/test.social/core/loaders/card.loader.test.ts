import {
    ANATOMY_CARD,
    ARCHITECTURE_CARD,
    FAQ_CARD,
    GRAMMAR_CARD,
    HOME_CARD,
    INFORMATION_CARD,
    LICENSE_CARD,
    METHODOLOGY_CARD,
    ONTOLOGY_CARD,
    PRIVACY_CARD,
    SEARCH_CARD,
    TERMS_CARD,
} from "@banes-lab/social-share/core/ids/card.ids.ts";
import { CARD_PLUGINS, cardPages, loadCards } from "@banes-lab/social-share/core/loaders/card.loader.ts";
import { HOME_PAGE, INFORMATION_PAGE, SEARCH_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { SITE_BYLINE, SITE_HOST, SITE_MARKS } from "@banes-lab/social-share/configuration/data/site.data.ts";
import { describe, expect, it } from "vitest";
import {
    getCard,
    listCards,
    registerCard,
    repeatedCards,
} from "@banes-lab/social-share/core/registries/card.registry.ts";
import { HOME_ACCENT } from "@banes-lab/web/configuration/constants/page.constants.ts";
import { SITE_NAME } from "@banes-lab/web/configuration/strings/page.strings.ts";
import { registeredPages } from "@banes-lab/web/domain/registries/page.registry.ts";

const CARD_IDS = [
    HOME_CARD,
    GRAMMAR_CARD,
    METHODOLOGY_CARD,
    ARCHITECTURE_CARD,
    ONTOLOGY_CARD,
    ANATOMY_CARD,
    FAQ_CARD,
    LICENSE_CARD,
    INFORMATION_CARD,
    TERMS_CARD,
    PRIVACY_CARD,
    SEARCH_CARD,
];

describe("loadCards", () => {
    it("discovers every card folder's plugin, registers its card and hands over the site's pages and marks", () => {
        const loaded = loadCards();
        expect(CARD_PLUGINS).toHaveLength(CARD_IDS.length);
        expect(loaded.plugins).toBe(CARD_PLUGINS);
        expect(loaded.cards.map((card) => card.id).toSorted()).toStrictEqual(CARD_IDS.toSorted());
        expect(loaded.repeated).toStrictEqual([]);
        expect(loaded.brand).toStrictEqual([SITE_NAME, SITE_BYLINE]);
        expect(SITE_MARKS).toStrictEqual(loaded.brand);
    });
});

describe("cardPages", () => {
    it("reads every registered page, unlisted ones included, with its accent, icon and share copy", () => {
        const pages = cardPages();
        expect(pages.map((page) => page.id)).toStrictEqual(registeredPages().map((page) => page.id));
        expect(pages.map((page) => page.id)).toEqual(expect.arrayContaining([INFORMATION_PAGE, SEARCH_PAGE]));
        const home = pages.find((page) => page.id === HOME_PAGE);
        expect(home?.accent).toBe(HOME_ACCENT);
        expect(home?.headline).toBe(SITE_NAME);
        expect(home?.address).toBe(SITE_HOST);
        expect(pages.find((page) => page.id === SEARCH_PAGE)?.address).toBe(`${SITE_HOST}/${SEARCH_PAGE}`);
        expect(home?.tagline.length).toBeGreaterThan(0);
    });
});

describe("the card registry", () => {
    it("records a second registration of one id as repeated", () => {
        const home = getCard(HOME_CARD);
        expect(home).toBeDefined();
        if (home !== undefined) {
            registerCard(home.spec, home.origin);
        }
        expect(repeatedCards()).toStrictEqual([HOME_CARD]);
        expect(listCards()).toHaveLength(CARD_IDS.length);
    });
});
