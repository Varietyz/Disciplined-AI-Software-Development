import { GRAMMAR_PAGE, METHODOLOGY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { describe, expect, it } from "vitest";
import { PAGE_TABS } from "@banes-lab/web/core/generated/tab.generated.ts";
import { UNLINKED_PAGE } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { linkFor } from "@banes-lab/web/configuration/icons/home.icons.ts";
import { pagePath } from "@banes-lab/web/core/assets/link.assets.ts";
import { tagsFor } from "@banes-lab/web/domain/converters/home.converter.ts";

describe("tagsFor", () => {
    it("gives a tabbed page one tag per tab, in publication order", () => {
        const tabs = PAGE_TABS.find((entry) => entry.page === METHODOLOGY_PAGE)?.tabs ?? [];
        expect(tagsFor(METHODOLOGY_PAGE).map((tag) => tag.label)).toStrictEqual(tabs.map((tab) => tab.label));
    });

    it("routes the first tag at the page itself, because that tab has no route of its own", () => {
        expect(tagsFor(GRAMMAR_PAGE).at(0)?.path).toBe(pagePath(GRAMMAR_PAGE));
    });

    it("gives every tag a served path", () => {
        for (const tag of tagsFor(GRAMMAR_PAGE)) {
            expect(tag.path.startsWith(pagePath(GRAMMAR_PAGE))).toBe(true);
        }
    });

    it("falls back to the platform pages for a page that publishes no tabs", () => {
        const tags = tagsFor("faq");
        expect(tags.length).toBeGreaterThan(0);
        for (const tag of tags) {
            expect(tag.path.startsWith("/")).toBe(true);
        }
    });
});

describe("linkFor", () => {
    it("resolves a page's icon and accent", () => {
        expect(linkFor(METHODOLOGY_PAGE).page).toBe(METHODOLOGY_PAGE);
        expect(linkFor(METHODOLOGY_PAGE).accent).not.toBe(linkFor(GRAMMAR_PAGE).accent);
    });

    it("refuses loudly a page with no home row link", () => {
        expect(() => linkFor("nothing")).toThrow(`${UNLINKED_PAGE}nothing`);
    });
});
