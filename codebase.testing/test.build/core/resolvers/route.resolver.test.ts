import { GUIDE, TERMS } from "../converters/site.fixture.ts";
import { describe, expect, it } from "vitest";
import {
    jsonPath,
    jsonPathOf,
    ledgerFile,
    sitemapPartFiles,
    sitemapPartRoute,
    markdownFileOf,
    markdownPathOf,
} from "@banes-lab/build-scripts/core/resolvers/route.resolver.ts";
import { JSON_ROUTE } from "@banes-lab/build-scripts/configuration/constants/site.constants.ts";
import { relativePath } from "@ssot/paths";

describe("jsonPath and jsonPathOf", () => {
    it("places a page payload under the json route by id and a tab payload beneath its page", () => {
        expect(jsonPath(TERMS)).toBe(`${JSON_ROUTE}terms`);
        expect(jsonPath(GUIDE)).toBe(`${JSON_ROUTE}terms/guide`);
        expect(jsonPathOf("terms")).toBe(jsonPath(TERMS));
    });
});

describe("markdownPathOf and markdownFileOf", () => {
    it("adds the md suffix to a route and names the home alternate index", () => {
        expect(markdownPathOf("/terms/guide")).toBe("/terms/guide.md");
        expect(markdownPathOf("/")).toBe("/index.md");
        expect(markdownFileOf("/")).toBe("index.md");
    });
});

describe("sitemapPartRoute and sitemapPartFiles", () => {
    it("keeps the first part's route, numbers the next ones, and lists the parts that exist in order", () => {
        expect(sitemapPartRoute("/sitemap-catalog.xml", 0)).toBe("/sitemap-catalog.xml");
        expect(sitemapPartRoute("/sitemap-catalog.xml", 2)).toBe("/sitemap-catalog-3.xml");
        const present = new Set(["sitemap-catalog.xml", "sitemap-catalog-2.xml"]);
        expect(sitemapPartFiles("/sitemap-catalog.xml", (file) => present.has(file))).toStrictEqual([
            "sitemap-catalog.xml",
            "sitemap-catalog-2.xml",
        ]);
        expect(sitemapPartFiles("/sitemap-none.xml", () => false)).toStrictEqual([]);
    });
});

describe("ledgerFile", () => {
    it("names the sitemap ledger at its path key", () => {
        expect(ledgerFile().split("\\").join("/")).toContain(relativePath("app.sitemap"));
    });
});
