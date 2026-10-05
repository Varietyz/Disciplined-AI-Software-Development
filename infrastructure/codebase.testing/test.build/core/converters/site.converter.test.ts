import { DISCOVERY, SITE, SOURCE } from "./site.fixture.ts";
import { describe, expect, it } from "vitest";
import { discover, tabsFromDiscovery } from "@banes-lab/build-scripts/core/converters/site.converter.ts";

describe("discover", () => {
    it("describes every page and every secondary tab as a route with its head, label and exported text", () => {
        const discovery = discover(SOURCE);
        expect(discovery.site).toBe(SITE);
        expect(discovery.pages.map((page) => [page.id, page.path, page.tab])).toStrictEqual([
            ["home", "/", null],
            ["terms", "/terms", null],
        ]);
        expect(discovery.routes.map((route) => [route.path, route.tab, route.label])).toStrictEqual([
            ["/", null, "Home"],
            ["/terms", null, "Terms"],
            ["/terms/guide", "guide", "Guide"],
        ]);
        expect(discovery.pages[0]?.content).toStrictEqual({ heading: "EXAMPLE", kind: "HOME" });
    });
});

describe("tabsFromDiscovery", () => {
    it("reads a page's tabs out of the discovered content and nothing for a page without tabs", () => {
        const tabsFor = tabsFromDiscovery(DISCOVERY);
        expect(tabsFor("terms").map((tab) => tab.id)).toStrictEqual(["intro", "guide"]);
        expect(tabsFor("home")).toStrictEqual([]);
    });
});
