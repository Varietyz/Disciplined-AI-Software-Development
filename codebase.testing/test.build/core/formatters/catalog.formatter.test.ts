import { describe, expect, it } from "vitest";
import type { Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import { llmsAppendix } from "@banes-lab/build-scripts/core/formatters/catalog.formatter.ts";

const SITE = "https://example.test";

const DISCOVERY: Discovery = {
    author: "Ada",
    consent: "Crawl freely.",
    name: "Example",
    pages: [],
    routes: [],
    site: SITE,
    summary: "An example site.",
};

describe("llmsAppendix", () => {
    it("adds the query grammar and the documents and contact to llms.txt", () => {
        const route = {
            description: "Terms.",
            label: "Terms",
            markdown: "",
            page: "terms",
            path: "/terms",
            tab: null,
            title: "Terms",
        };
        const text = llmsAppendix(DISCOVERY, [route]).join("\n");
        expect(text).toContain("## Query");
        expect(text).toContain(`${SITE}/json/api, and as Markdown at ${SITE}/api.md`);
        expect(text).toContain(`- [Terms](${SITE}/terms): Terms.`);
        expect(text).toContain(`- [Contact](${SITE}/api/contact.md)`);
    });
});
