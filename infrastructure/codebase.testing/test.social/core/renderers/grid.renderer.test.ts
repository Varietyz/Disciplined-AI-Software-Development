import type { CardPage, RegisteredCard } from "@banes-lab/social-share/types/card.types.ts";
import { describe, expect, it } from "vitest";
import { STAGE_HEADING } from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import { createCard } from "@banes-lab/social-share/core/factories/card.factory.ts";
import { renderGrid } from "@banes-lab/social-share/core/renderers/grid.renderer.ts";

type Resize = (entries: readonly unknown[]) => void;

const observers: { resize: Resize; disconnected: boolean }[] = [];

class StubObserver {
    private readonly entry: { resize: Resize; disconnected: boolean };

    public constructor(callback: Resize) {
        this.entry = { disconnected: false, resize: callback };
        observers.push(this.entry);
    }

    public observe(): void {}

    public disconnect(): void {
        this.entry.disconnected = true;
    }
}

Reflect.set(globalThis, "ResizeObserver", StubObserver);
Reflect.set(globalThis, "IntersectionObserver", StubObserver);

const pageOf = function pageOf(id: string, headline: string, icon: string): CardPage {
    return {
        accent: "page-sky",
        address: `lab.example/${id}`,
        headline,
        icon,
        id,
        mark: "/mark.gif",
        tagline: "Answers",
    };
};

const HOME = pageOf("home", "Home", "bi-house");
const FAQ = pageOf("faq", "Questions", "bi-question-circle");

const cardOf = function cardOf(page: CardPage): RegisteredCard {
    return {
        id: page.id,
        origin: `/cards/${page.id}/plugins/${page.id}.plugin.ts`,
        spec: createCard({
            alt: "A card.",
            id: page.id,
            layers: [{ id: "title", kind: "text", placement: { x: 0.1, y: 0.1 }, text: page.headline }],
            page: page.id,
            stylesheet: "",
            tone: page.accent,
        }),
    };
};

describe("renderGrid", () => {
    it("lays one spread per card in page order, each titled by its page's icon and headline in its tone", () => {
        const host = document.createElement("main");
        const stop = renderGrid(
            host,
            [cardOf(FAQ), cardOf(HOME)],
            [HOME, FAQ],
            [{ card: "stray", message: "is orphaned." }],
        );
        expect(host.querySelector(".stage-heading")?.textContent).toBe(STAGE_HEADING);
        const spreads = [...host.querySelectorAll(".stage-spread")];
        expect(spreads.map((spread) => spread.querySelector(".stage-spread-title")?.textContent)).toStrictEqual([
            HOME.headline,
            FAQ.headline,
        ]);
        const [first] = spreads;
        expect(first?.classList.contains(HOME.accent)).toBe(true);
        expect(first?.querySelector(".stage-spread-title i")?.classList.contains(HOME.icon)).toBe(true);
        expect(first?.querySelector(".stage-spread-meta")?.textContent).toContain(HOME.address);
        expect(first?.querySelectorAll(".stage-tile")).toHaveLength(cardOf(HOME).spec.profiles.length);
        expect(host.querySelector(".stage-findings")?.textContent).toContain("stray");
        for (const observer of observers) {
            observer.resize([]);
        }
        stop();
        expect(observers.every((observer) => observer.disconnected)).toBe(true);
    });
});
