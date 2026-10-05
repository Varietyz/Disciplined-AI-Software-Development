import { PAGE_ATTRIBUTE, createMenuButton } from "@banes-lab/web/presentation/components/menu.component.ts";
import { describe, expect, it } from "vitest";
import type { PageEntry } from "@banes-lab/web/types/page.types.ts";
import { ROUTE_REQUESTED } from "@banes-lab/web/core/ids/route.ids.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";

const ICON = "bi-house";
const TAB_BUTTON_CLASS = "tab-button";
const ACCENT = "page-gold";
const PAGE: PageEntry = {
    accent: ACCENT,
    description: "The landing page.",
    icon: ICON,
    id: "home",
    listed: true,
    load: async () => {
        await Promise.resolve();
        return {
            content: { heading: "Home", kind: "home", lead: "Home lead.", rows: [], stats: [], thesis: "Home thesis." },
            description: "The landing page.",
            id: "home",
            render: () => createElement("div"),
            title: "Home",
        };
    },
    mark: "/mark.gif",
    order: 1,
    share: { headline: "Home", tagline: "Home tagline." },
    title: "Home",
};

describe("createMenuButton", () => {
    it("renders a tab-bar button tagged with the page and requests its route on click", () => {
        const pages: string[] = [];
        const dispose = subscribeEvent(ROUTE_REQUESTED, (event) => {
            pages.push(event.page);
        });
        const button = createMenuButton(PAGE);
        expect(button.classList.contains(TAB_BUTTON_CLASS)).toBe(true);
        expect(button.classList.contains(ACCENT)).toBe(true);
        expect(button.getAttribute(PAGE_ATTRIBUTE)).toBe(PAGE.id);
        expect(button.textContent).toBe(PAGE.title);
        button.click();
        dispose();
        expect(pages).toStrictEqual([PAGE.id]);
    });
});
