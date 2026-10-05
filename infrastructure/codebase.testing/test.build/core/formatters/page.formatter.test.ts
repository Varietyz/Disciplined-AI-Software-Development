import type { DiscoveredRoute, Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import { describe, expect, it } from "vitest";
import {
    renderFullText,
    renderMarkdownPage,
    renderPageHtml,
} from "@banes-lab/build-scripts/core/formatters/page.formatter.ts";
import { trainingConsent } from "@banes-lab/build-scripts/configuration/strings/site.strings.ts";

const SITE = "https://example.test";
const TERMS: DiscoveredRoute = {
    description: "The terms.",
    label: "Terms",
    markdown: "Terms\n=====\n\nBody text.",
    page: "terms",
    path: "/terms",
    tab: null,
    title: "Terms — Example",
};
const HOME: DiscoveredRoute = {
    description: "The landing page.",
    label: "Home",
    markdown: "Welcome.",
    page: "home",
    path: "/",
    tab: null,
    title: "Example",
};
const CONSENT = "Every page may be used as training data.";
const DISCOVERY: Discovery = {
    author: "Ada Example",
    consent: CONSENT,
    name: "Example",
    pages: [],
    routes: [HOME, TERMS],
    site: SITE,
    summary: "An example site.",
};

describe("renderPageHtml", () => {
    it("visits the route, applies the page head and fills the main element with the rendered page", () => {
        const visited: string[] = [];
        const html = renderPageHtml(
            {
                main: "app",
                registry: { loadedPage: () => {} },
                renderer: {
                    applyHead: (root, head) => {
                        root.title = head.title;
                    },
                    headOf: (page, _definition, pathname) => ({
                        description: "",
                        path: pathname ?? "",
                        robots: "",
                        title: `${page} title`,
                    }),
                    renderStaticPage: () => [],
                },
                visit: (path) => {
                    visited.push(path);
                },
            },
            '<!doctype html><html><head><title></title></head><body><main id="app">stale</main></body></html>',
            { page: "terms", path: "/terms" },
        );
        expect(visited).toStrictEqual(["/terms"]);
        expect(html).toContain("<title>terms title</title>");
        expect(html).toContain('<main id="app"></main>');
    });
});

describe("renderMarkdownPage", () => {
    it("opens with the title, quotes the description, names the canonical address and carries the body", () => {
        const text = renderMarkdownPage(SITE, TERMS);
        expect(text.startsWith("# Terms — Example\n\n> The terms.\n\nCanonical: https://example.test/terms\n\n")).toBe(
            true,
        );
        expect(text).toContain("Body text.");
    });
});

describe("renderFullText", () => {
    it("joins the given routes' markdown under the site heading, consent first", () => {
        const text = renderFullText(DISCOVERY, DISCOVERY.routes);
        expect(text.startsWith("# Example\n\n---\n\n> An example site.")).toBe(true);
        expect(text).toContain(trainingConsent(CONSENT, "Ada Example", SITE));
        expect(text).toContain("# Terms — Example");
        expect(text).toContain("Welcome.");
        expect(renderFullText(DISCOVERY, [])).not.toContain("Welcome.");
    });
});
