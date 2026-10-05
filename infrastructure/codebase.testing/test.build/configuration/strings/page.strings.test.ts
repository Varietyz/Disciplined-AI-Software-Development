import { describe, expect, it } from "vitest";
import {
    missingAlternate,
    missingSectionElement,
    noSectionText,
    oversizeSitemap,
    prerenderLine,
    sourceFileDescription,
    sourceFolderDescription,
    sourcePagesLine,
    unregisteredPage,
    unstampedRoute,
} from "@banes-lab/build-scripts/configuration/strings/page.strings.ts";

describe("the source page lines", () => {
    it("describe a file and a folder by their tree, and report the pages and the cap", () => {
        expect(sourceFileDescription("a.ts", "Site", "2 lines of code and 1 definition.")).toBe(
            "a.ts is a file in Site. 2 lines of code and 1 definition.",
        );
        expect(sourceFolderDescription("core", "Site", 1)).toBe("core is a folder in Site with 1 file.");
        expect(sourceFolderDescription("core", "Site", 3)).toBe("core is a folder in Site with 3 files.");
        expect(sourcePagesLine(4, "/sitemap-sources.xml")).toContain("wrote 4 source page(s)");
        expect(oversizeSitemap("/a.xml", 50_001, 10)).toContain("/a.xml holds 50001 URL(s)");
        expect(missingAlternate("/anatomy/tree/file-a")).toContain("/anatomy/tree/file-a");
    });
});

describe("the prerender lines", () => {
    it("report the routes written, and name the page, path or section each failure is about", () => {
        expect(prerenderLine(2, 5)).toContain("wrote 2 route(s)");
        expect(prerenderLine(2, 5)).toContain("5 catalog file(s)");
        expect(unregisteredPage("faq")).toContain('the page id "faq" is declared but no view registers it');
        expect(missingSectionElement("/faq", "a")).toContain('/faq renders no element for the section id "a"');
        expect(noSectionText("/faq", 2)).toContain("/faq exported no text for its 2 section(s)");
        expect(unstampedRoute("/faq")).toContain("route /faq has no last-modified stamp");
    });
});
