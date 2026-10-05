import "@banes-lab/web/presentation/records/grammar.record.ts";
import {
    createExternalLink,
    createLink,
    createPageLink,
} from "@banes-lab/web/presentation/components/link.component.ts";
import { describe, expect, it, vi } from "vitest";
import { pagePath, tabLink } from "@banes-lab/web/core/assets/link.assets.ts";
import { GRAMMAR_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { MAIN_ID } from "@banes-lab/web/core/ids/site.ids.ts";
import { ROUTE_REQUESTED } from "@banes-lab/web/core/ids/route.ids.ts";
import { getPage } from "@banes-lab/web/domain/registries/page.registry.ts";
import { subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";

const CLASS_NAME = "link";
const LABEL = "Open";
const EXTERNAL = "https://example.com/";
const TAB = "guide";
const GENERIC = "Start";
const CONTEXT_SELECTOR = ".visually-hidden";

const requestedPages = function requestedPages(link: HTMLAnchorElement): readonly string[] {
    const pages: string[] = [];
    const dispose = subscribeEvent(ROUTE_REQUESTED, (event) => {
        pages.push(event.page + (event.path ?? ""));
    });
    link.click();
    dispose();
    return pages;
};

describe("createPageLink", () => {
    it("points at the page path and requests the route on click", () => {
        const link = createPageLink(GRAMMAR_PAGE, CLASS_NAME, [LABEL]);
        expect(link.pathname).toBe(pagePath(GRAMMAR_PAGE));
        expect(link.className).toBe(CLASS_NAME);
        expect(requestedPages(link)).toStrictEqual([GRAMMAR_PAGE + pagePath(GRAMMAR_PAGE)]);
    });

    it("gives a generic label its destination page as hidden context, and leaves a descriptive one alone", () => {
        const generic = createPageLink(GRAMMAR_PAGE, CLASS_NAME, [GENERIC]);
        expect(generic.querySelector(CONTEXT_SELECTOR)?.textContent).toContain(getPage(GRAMMAR_PAGE)?.title);
        expect(createPageLink(GRAMMAR_PAGE, CLASS_NAME, [LABEL]).querySelector(CONTEXT_SELECTOR)).toBeNull();
    });
});

describe("createExternalLink", () => {
    it("opens in a new tab with a safe rel", () => {
        const link = createExternalLink(EXTERNAL, CLASS_NAME, [LABEL]);
        expect(link.href).toBe(EXTERNAL);
        expect(link.target).toBe("_blank");
        expect(link.rel.includes("noopener")).toBe(true);
    });
});

describe("createLink", () => {
    it("routes internal hrefs through the page link, keeping the full path", () => {
        const href = tabLink(GRAMMAR_PAGE, TAB, "setup");
        const link = createLink(href, CLASS_NAME, [LABEL]);
        expect(link.getAttribute("href")).toBe(href);
        expect(requestedPages(link)).toStrictEqual([GRAMMAR_PAGE + href]);
        expect(createLink(`${pagePath(GRAMMAR_PAGE)}?x=1`, CLASS_NAME, [LABEL]).getAttribute("href")).toBe(
            `${pagePath(GRAMMAR_PAGE)}?x=1`,
        );
    });

    it("treats other hrefs as external", () => {
        expect(createLink(EXTERNAL, CLASS_NAME, [LABEL]).target).toBe("_blank");
    });

    it("keeps a bare anchor on the page, reveals its collapsed target and leaves the class off when none is given", () => {
        const main = document.createElement("main");
        main.id = MAIN_ID;
        Object.defineProperty(main, "scrollTo", { configurable: true, value: vi.fn() });
        const target = document.createElement("article");
        target.id = "record-one";
        const details = document.createElement("details");
        target.append(details);
        main.append(target);
        document.body.append(main);
        const link = createLink("#record-one", "", [LABEL]);
        expect(link.getAttribute("href")).toBe("#record-one");
        expect(link.hasAttribute("class")).toBe(false);
        expect(requestedPages(link)).toStrictEqual([]);
        expect(details.open).toBe(true);
        main.remove();
    });

    it("scrolls instead of re-routing when a full path points at the tab already shown", () => {
        const href = `${window.location.pathname}#elsewhere`;
        const link = createLink(href, CLASS_NAME, [LABEL]);
        expect(requestedPages(link)).toStrictEqual([]);
    });
});
