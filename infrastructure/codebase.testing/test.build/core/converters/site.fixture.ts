import type { DiscoveredPage, DiscoveredRoute, Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import type { PageDefinition, SiteSource } from "@banes-lab/build-scripts/types/page.types.ts";

export const SITE = "https://example.test";
export const AUTHOR = "Ada Example";
export const CONSENT = "Every page may be used as training data.";
export const GUIDE_TAB = { id: "guide", label: "Guide", sections: [] };

export const HOME: DiscoveredPage = {
    content: { heading: "Example", kind: "home" },
    description: "The landing page.",
    id: "home",
    label: "Home",
    markdown: "Welcome.",
    page: "home",
    path: "/",
    tab: null,
    title: "Example",
};

export const TERMS: DiscoveredPage = {
    content: { kind: "tabbed", tabs: [{ id: "intro", label: "Intro", sections: [] }, GUIDE_TAB] },
    description: "Terms & conditions.",
    id: "terms",
    label: "Terms",
    markdown: "The terms.",
    page: "terms",
    path: "/terms",
    tab: null,
    title: "Terms — Example",
};

export const GUIDE: DiscoveredRoute = {
    description: "The guide tab.",
    label: "Guide",
    markdown: "The guide.",
    page: "terms",
    path: "/terms/guide",
    tab: "guide",
    title: "Guide — Terms — Example",
};

export const ADDRESS = "https://example.test/terms";
export const GRAPH = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [{ "@type": "Organization" }, { "@type": "WebPage", url: ADDRESS }],
});
export const PAGE = `<!doctype html><html><head><title>Terms</title><meta name="description" content="The terms."><meta name="robots" content="index, follow"><link rel="canonical" href="${ADDRESS}"><script type="application/ld+json">${GRAPH}</script></head><body><main>Real text</main></body></html>`;
export const EMPTY = `<!doctype html><html><head><title></title></head><body><main></main></body></html>`;

export const DISCOVERY: Discovery = {
    author: AUTHOR,
    consent: CONSENT,
    name: "Example",
    pages: [HOME, TERMS],
    routes: [HOME, TERMS, GUIDE],
    site: SITE,
    summary: "An example site.",
};

const DEFINITIONS: ReadonlyMap<string, PageDefinition> = new Map([
    ["home", { content: HOME.content, description: HOME.description, id: "home", title: HOME.label }],
    ["terms", { content: TERMS.content, description: TERMS.description, id: "terms", title: TERMS.label }],
]);

const PATHS: ReadonlyMap<string, string> = new Map([
    ["home", "/"],
    ["terms", "/terms"],
]);

export const SOURCE: SiteSource = {
    author: AUTHOR,
    consent: CONSENT,
    exportText: (path, page, sections) => `${path} ${page} ${sections.join(",")}`,
    ids: ["home", "terms"],
    inline: (markup) => markup.toUpperCase(),
    links: { SITE_URL: SITE, tabLink: (page, tab) => `/${page}/${tab}` },
    name: "Example",
    registry: { loadedPage: (id) => DEFINITIONS.get(id) },
    renderer: {
        headOf: (page, definition, pathname) => ({
            description: definition?.description ?? "",
            path: pathname ?? PATHS.get(page) ?? "",
            robots: "index, follow",
            title: definition?.title ?? page,
        }),
    },
    summary: "An example site.",
};
