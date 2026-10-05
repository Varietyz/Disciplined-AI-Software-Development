import { DISCOVERY, GUIDE, GUIDE_TAB, HOME, TERMS } from "../converters/site.fixture.ts";
import { describe, expect, it } from "vitest";
import {
    fullTextFileOf,
    fullTextParts,
    fullTextRoutes,
    isFullTextRoute,
    routeContentOf,
    routeOf,
    tabContentOf,
} from "@banes-lab/build-scripts/core/selectors/site.selector.ts";

describe("isFullTextRoute, fullTextRoutes, fullTextFileOf and fullTextParts", () => {
    it("keeps every route outside the reference pages and gives each teaching page its own part file", () => {
        expect(isFullTextRoute({ page: "terms" })).toBe(true);
        expect(isFullTextRoute({ page: "ontology" })).toBe(false);
        expect(isFullTextRoute({ page: "anatomy" })).toBe(false);
        expect(fullTextRoutes(DISCOVERY)).toStrictEqual([HOME, TERMS, GUIDE]);
        expect(fullTextFileOf("terms")).toBe("llms-full/terms.txt");
        expect(fullTextParts(DISCOVERY).map((part) => [part.file, part.label, part.routes.length])).toStrictEqual([
            ["llms-full/home.txt", HOME.label, 1],
            ["llms-full/terms.txt", TERMS.label, 2],
        ]);
    });
});

describe("tabContentOf", () => {
    it("finds a tab by id inside tabbed content and nothing in any other content", () => {
        expect(tabContentOf(TERMS.content, "guide")).toBe(GUIDE_TAB);
        expect(tabContentOf(HOME.content, "guide")).toBeUndefined();
    });
});

describe("routeContentOf", () => {
    it("gives a page route its page's content and a tab route that tab alone", () => {
        expect(routeContentOf(DISCOVERY, TERMS)).toBe(TERMS.content);
        expect(routeContentOf(DISCOVERY, GUIDE)).toBe(GUIDE_TAB);
    });
});

describe("routeOf", () => {
    it("resolves a page or a tab route by page id and tab id", () => {
        expect(routeOf(DISCOVERY, "terms", "guide")).toBe(GUIDE);
        expect(routeOf(DISCOVERY, "terms", null)).toBe(TERMS);
        expect(routeOf(DISCOVERY, "terms", "gone")).toBeUndefined();
    });
});
