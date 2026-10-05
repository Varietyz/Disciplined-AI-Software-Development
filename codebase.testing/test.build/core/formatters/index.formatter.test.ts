import { describe, expect, it } from "vitest";
import { renderIndex, renderSiteIndex } from "@banes-lab/build-scripts/core/formatters/index.formatter.ts";

const ENTRY = {
    bytes: 1,
    fingerprint: "f",
    href: null,
    json: "https://x.test/json/e",
    kind: "section",
    markdown: null,
    ref: "e",
    summary: "E.",
    title: "E",
};

describe("renderIndex", () => {
    it("lists each entry by its best leaf with its summary", () => {
        const identity = {
            address: { json: "/json/api/x", markdown: "/api/x.md" },
            href: "/x",
            kind: "index",
            ref: "api:x",
            summary: "An index.",
            title: "X",
        };
        expect(renderIndex(identity, { ref: "api:x", title: "X" }, [ENTRY], "https://x.test")).toContain(
            "- [E](https://x.test/json/e): E.",
        );
    });
});

describe("renderSiteIndex", () => {
    it("names each address pattern with its JSON and Markdown forms", () => {
        const site = renderSiteIndex(
            {
                build: "b1",
                canonical: "The JSON files are canonical.",
                collections: [],
                consent: "Yes.",
                documents: [],
                grammar: [{ json: "/json/api", level: "The site", markdown: "/api.md" }],
                pages: [ENTRY],
                queries: [],
                summary: "S.",
                title: "Site",
                trees: [],
                updated: null,
                version: 2,
            },
            "https://x.test",
        );
        expect(site).toContain("The site: `/json/api` or `/api.md`");
        expect(site).toContain("The JSON files are canonical.");
        expect(site).toContain("Catalog version 2, build b1.");
    });
});
