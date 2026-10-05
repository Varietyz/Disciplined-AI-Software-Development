import { describe, expect, it } from "vitest";
import { pageTabsOf } from "@banes-lab/build-scripts/core/converters/tab.converter.ts";

const tabsFor = function tabsFor(): readonly { readonly id: unknown; readonly label: unknown }[] {
    return [
        { id: "intro", label: "Intro" },
        { id: "guide", label: "Guide" },
        { id: 3, label: "Broken" },
    ];
};

describe("pageTabsOf", () => {
    it("serves the first tab at the page path and each other tab at its own link, dropping a tab with no id", () => {
        const router = {
            pagePath: (page: string) => `/${page}`,
            tabLink: (page: string, tab: string) => `/${page}/${tab}`,
        };
        expect(pageTabsOf(router, "terms", tabsFor)).toStrictEqual({
            page: "terms",
            tabs: [
                { id: "intro", label: "Intro", path: "/terms" },
                { id: "guide", label: "Guide", path: "/terms/guide" },
            ],
        });
    });
});
