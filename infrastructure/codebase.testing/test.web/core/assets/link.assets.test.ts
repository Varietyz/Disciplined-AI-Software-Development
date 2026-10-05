import {
    CATALOG_MARKDOWN_ROUTE,
    CATALOG_ROUTE,
    HOME_PATH,
    faceIndexPath,
    markdownTwinPath,
    nodeFromPath,
    pageFromPath,
    pageIndexPath,
    pagePath,
    payloadTwinPath,
    queryPath,
    queryValue,
    sectionLeafPath,
    sectionMarkdownPath,
    tabFromPath,
    tabLink,
    tabPath,
    treeNodePath,
} from "@banes-lab/web/core/assets/link.assets.ts";
import { describe, expect, it } from "vitest";
import { ANCHOR_PREFIX } from "@banes-lab/web/configuration/constants/document.constants.ts";

const PAGE = "grammar";
const TAB = "guide";
const SECTION = "setup";
const HOME = "home";
const TABS = [{ id: "introduction" }, { id: TAB }];

describe("pagePath", () => {
    it("prefixes the page id with the home path", () => {
        expect(pagePath(PAGE)).toBe(HOME_PATH + PAGE);
        expect(pagePath(HOME)).toBe(HOME_PATH);
    });
});

describe("pageFromPath", () => {
    it("maps the home path to the home page", () => {
        expect(pageFromPath(HOME_PATH, HOME)).toBe(HOME);
    });

    it("reads the first segment, ignoring a trailing slash and a tab segment", () => {
        expect(pageFromPath(pagePath(PAGE), HOME)).toBe(PAGE);
        expect(pageFromPath(pagePath(PAGE) + HOME_PATH, HOME)).toBe(PAGE);
        expect(pageFromPath(tabLink(PAGE, TAB), HOME)).toBe(PAGE);
    });
});

describe("tabFromPath", () => {
    it("reads the second segment as the tab, or nothing", () => {
        expect(tabFromPath(tabLink(PAGE, TAB))).toBe(TAB);
        expect(tabFromPath(pagePath(PAGE))).toBeNull();
        expect(tabFromPath(HOME_PATH)).toBeNull();
    });
});

describe("treeNodePath and nodeFromPath", () => {
    it("routes a node under its page and tab, and reads the node back from the path", () => {
        const path = treeNodePath("anatomy", "governance", "file-a-ts");
        expect(path).toBe("/anatomy/governance/file-a-ts");
        expect(nodeFromPath(path)).toBe("file-a-ts");
        expect(nodeFromPath(`${path}#line`)).toBe("file-a-ts");
        expect(nodeFromPath("/anatomy/governance")).toBeNull();
    });
});

describe("tabLink", () => {
    it("carries the tab as a path segment", () => {
        expect(tabLink(PAGE, TAB)).toBe(`${pagePath(PAGE)}/${TAB}`);
    });

    it("appends the section as a fragment when one is given", () => {
        expect(tabLink(PAGE, TAB, SECTION)).toBe(tabLink(PAGE, TAB) + ANCHOR_PREFIX + SECTION);
        expect(tabFromPath(tabLink(PAGE, TAB, SECTION))).toBe(TAB);
    });
});

describe("CATALOG_ROUTE and CATALOG_MARKDOWN_ROUTE", () => {
    it("name the catalog root as JSON and as Markdown", () => {
        expect(CATALOG_ROUTE).toBe("/json/api");
        expect(CATALOG_MARKDOWN_ROUTE).toBe("/api.md");
    });
});

describe("markdownTwinPath and payloadTwinPath", () => {
    it("derive a route's Markdown alternate and JSON payload from its path", () => {
        expect(markdownTwinPath(tabLink(PAGE, TAB))).toBe(`${tabLink(PAGE, TAB)}.md`);
        expect(markdownTwinPath(HOME_PATH)).toBe("/index.md");
        expect(payloadTwinPath(tabLink(PAGE, TAB))).toBe(`/json/${PAGE}/${TAB}`);
        expect(payloadTwinPath(HOME_PATH)).toBe(`/json/${HOME}`);
    });
});

describe("faceIndexPath", () => {
    it("places a collection's record index under the catalog's json route", () => {
        expect(faceIndexPath("architecture")).toBe("/json/api/records/architecture");
    });
});

describe("pageIndexPath, sectionLeafPath and sectionMarkdownPath", () => {
    it("address a page's catalog index and one section's JSON and Markdown leaves, with and without a tab", () => {
        expect(pageIndexPath("faq")).toBe("/json/api/pages/faq");
        expect(sectionLeafPath("pag", "syntax", "blocks")).toBe("/json/pag/syntax/blocks");
        expect(sectionLeafPath("faq", null, "why")).toBe("/json/faq/why");
        expect(sectionMarkdownPath("pag", "syntax", "blocks")).toBe("/pag/syntax/blocks.md");
        expect(sectionMarkdownPath("faq", null, "why")).toBe("/faq/why.md");
    });
});

describe("queryPath and queryValue", () => {
    it("carries an encoded query on the page path and reads it back", () => {
        const path = queryPath(PAGE, "q", "gate & check");
        expect(pageFromPath(path, HOME)).toBe(PAGE);
        const search = path.slice(path.indexOf("?"));
        expect(queryValue(search, "q")).toBe("gate & check");
    });

    it("reads an absent parameter as empty", () => {
        expect(queryValue("", "q")).toBe("");
    });
});

describe("tabPath", () => {
    it("gives the first tab the page path and every other tab its own", () => {
        expect(tabPath(PAGE, TABS, "introduction")).toBe(pagePath(PAGE));
        expect(tabPath(PAGE, TABS, TAB)).toBe(tabLink(PAGE, TAB));
    });
});
