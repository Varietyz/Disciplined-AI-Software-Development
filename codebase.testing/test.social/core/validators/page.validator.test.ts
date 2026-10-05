import {
    ADDRESS_OVERFLOWS,
    OFF_BRAND,
    OFF_TONE,
    PAGE_SHARED,
    PAGE_WITHOUT_CARD,
} from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import type { CardContext, CardInput, RegisteredCard } from "@banes-lab/social-share/types/card.types.ts";
import { brandFindings, coverageFindings } from "@banes-lab/social-share/core/validators/page.validator.ts";
import { describe, expect, it } from "vitest";
import { PROFILES } from "@banes-lab/social-share/configuration/configs/card.config.ts";
import { createCard } from "@banes-lab/social-share/core/factories/card.factory.ts";

const HOME = {
    accent: "page-gold",
    address: "lab.example",
    headline: "Home",
    icon: "bi-house",
    id: "home",
    mark: "/thumbnail.gif",
    tagline: "The home page",
};
const FAQ = {
    accent: "page-sky",
    address: "lab.example/faq",
    headline: "FAQ",
    icon: "bi-question-circle",
    id: "faq",
    mark: "/badge.gif",
    tagline: "Questions",
};
const CONTEXT: CardContext = { brand: ["Lab"], pages: [HOME, FAQ], profiles: PROFILES, repeated: [] };

const textLayer = function textLayer(id: string, text: string): CardInput["layers"][number] {
    return { id, kind: "text", placement: { x: 0.1, y: 0.1 }, text };
};

const card = function card(id: string, input: Partial<CardInput>): RegisteredCard {
    const spec = createCard({
        alt: id,
        id,
        layers: [
            textLayer("title", HOME.headline),
            textLayer("subtitle", HOME.tagline),
            textLayer("kicker", "Lab"),
            textLayer("domain", HOME.address),
            { alt: "Mark", id: "mark", kind: "animation", placement: { x: 0.2, y: 0.5 }, source: HOME.mark },
        ],
        page: HOME.id,
        stylesheet: "",
        tone: HOME.accent,
        ...input,
    });
    return { id, origin: `/cards/${id}/plugins/${id}.plugin.ts`, spec };
};

describe("coverageFindings", () => {
    it("reports a page with no card and a page served by two cards", () => {
        const findings = coverageFindings([card("first", {}), card("second", {})], CONTEXT.pages);
        expect(findings).toContainEqual({ card: FAQ.id, message: PAGE_WITHOUT_CARD });
        expect(findings).toContainEqual({ card: HOME.id, message: `${PAGE_SHARED} first, second` });
    });

    it("passes when every page has exactly one card", () => {
        expect(coverageFindings([card("home", {}), card("faq", { page: FAQ.id })], CONTEXT.pages)).toStrictEqual([]);
    });
});

describe("brandFindings", () => {
    it("passes a card that shows its page's brand mark, headline, tagline and every site mark in its page's tone", () => {
        expect(brandFindings([card("home", {})], CONTEXT)).toStrictEqual([]);
    });

    it("reports a card in another tone and names each missing brand part", () => {
        const findings = brandFindings(
            [card("home", { layers: [textLayer("title", HOME.headline)], tone: FAQ.accent })],
            CONTEXT,
        );
        expect(findings).toContainEqual({ card: "home", message: OFF_TONE });
        expect(findings).toContainEqual({
            card: "home",
            message: `${OFF_BRAND} ${HOME.mark}, ${HOME.tagline}, ${HOME.address}, Lab`,
        });
    });

    it("reports an address wider than the room its layer gives it on one line", () => {
        const cramped = card("home", {
            layers: [
                textLayer("title", HOME.headline),
                textLayer("subtitle", HOME.tagline),
                textLayer("kicker", "Lab"),
                { alt: "Mark", id: "mark", kind: "animation", placement: { x: 0.2, y: 0.5 }, source: HOME.mark },
                {
                    id: "domain",
                    kind: "text",
                    placement: { width: 0.05, x: 0.9, y: 0.9 },
                    style: { fontSize: "40px" },
                    text: HOME.address,
                },
            ],
        });
        const messages = brandFindings([cramped], CONTEXT).map((finding) => finding.message);
        expect(messages.some((message) => message.startsWith(ADDRESS_OVERFLOWS))).toBe(true);
    });

    it("skips a card whose page is not registered, which the spec check reports instead", () => {
        expect(brandFindings([card("stray", { page: "nowhere" })], CONTEXT)).toStrictEqual([]);
    });
});
