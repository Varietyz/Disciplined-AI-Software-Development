import "@banes-lab/web/presentation/records/home.record.ts";
import "@banes-lab/web/presentation/records/grammar.record.ts";
import { GRAMMAR_PAGE, HOME_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import {
    HOME_PATH,
    SITE_URL,
    markdownTwinPath,
    pagePath,
    payloadTwinPath,
    tabLink,
} from "@banes-lab/web/core/assets/link.assets.ts";
import { MISSING_PAGE_TITLE, SITE_NAME } from "@banes-lab/web/configuration/strings/page.strings.ts";
import {
    ROBOTS_INDEX,
    ROBOTS_NOINDEX,
    STATIC_RENDER_ATTRIBUTE,
} from "@banes-lab/web/configuration/constants/document.constants.ts";
import {
    applyHead,
    headOf,
    renderPage,
    renderStaticPage,
    secondaryTab,
    sourceHead,
    tabHead,
} from "@banes-lab/web/presentation/renderers/page.renderer.ts";
import { describe, expect, it } from "vitest";
import { loadPage, loadedPage } from "@banes-lab/web/domain/registries/page.registry.ts";
import { COPY_PAGE_TITLE } from "@banes-lab/web/configuration/strings/clipboard.strings.ts";
import { GRAMMAR_TABS } from "@banes-lab/web/core/generated/grammar.page.generated.ts";
import { MISSING_SHARE } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { SHARE_IMAGES } from "@banes-lab/web/core/generated/share.generated.ts";
import { exportText } from "@banes-lab/web/core/converters/text.converter.ts";
import { isStaticRender } from "@banes-lab/web/core/predicates/document.predicate.ts";

await loadPage(HOME_PAGE);
await loadPage(GRAMMAR_PAGE);

const getPage = loadedPage;
const UNKNOWN = "no-such-page";
const CONTENT_CLASS = "page-content";
const FOOTER_CLASS = "site-footer";
const LICENSE_SELECTOR = ".site-license";
const HOME_CLASS = "home-content";
const DESCRIPTION_SLOT = 'meta[name="description"]';
const OG_URL_SLOT = 'meta[property="og:url"]';
const OG_TYPE_SLOT = 'meta[property="og:type"]';
const OG_IMAGE_SLOT = 'meta[property="og:image"]';
const OG_IMAGE_ALT_SLOT = 'meta[property="og:image:alt"]';
const OG_VIDEO_SLOT = 'meta[property="og:video"]';
const TWITTER_IMAGE_SLOT = 'meta[name="twitter:image"]';
const ROBOTS_SLOT = 'meta[name="robots"]';
const CANONICAL_SLOT = 'link[rel="canonical"]';
const MARKDOWN_ALTERNATE_SLOT = 'link[rel="alternate"][type="text/markdown"]';
const JSON_ALTERNATE_SLOT = 'link[rel="alternate"][type="application/json"]';
const SCHEMA_SLOT = 'script[type="application/ld+json"]';
const COPY_SELECTOR = ".copy-all";

const headDocument = function headDocument(): Document {
    const root = document.implementation.createHTMLDocument();
    const description = root.createElement("meta");
    description.setAttribute("name", "description");
    const openGraphUrl = root.createElement("meta");
    openGraphUrl.setAttribute("property", "og:url");
    const openGraphType = root.createElement("meta");
    openGraphType.setAttribute("property", "og:type");
    const openGraphImage = root.createElement("meta");
    openGraphImage.setAttribute("property", "og:image");
    const openGraphImageAlt = root.createElement("meta");
    openGraphImageAlt.setAttribute("property", "og:image:alt");
    const twitterImage = root.createElement("meta");
    twitterImage.setAttribute("name", "twitter:image");
    const robots = root.createElement("meta");
    robots.setAttribute("name", "robots");
    const canonical = root.createElement("link");
    canonical.setAttribute("rel", "canonical");
    const markdownTwin = root.createElement("link");
    markdownTwin.setAttribute("rel", "alternate");
    markdownTwin.setAttribute("type", "text/markdown");
    const jsonTwin = root.createElement("link");
    jsonTwin.setAttribute("rel", "alternate");
    jsonTwin.setAttribute("type", "application/json");
    const schema = root.createElement("script");
    schema.setAttribute("type", "application/ld+json");
    root.head.append(
        description,
        openGraphUrl,
        openGraphType,
        openGraphImage,
        openGraphImageAlt,
        twitterImage,
        robots,
        canonical,
        markdownTwin,
        jsonTwin,
        schema,
    );
    return root;
};

describe("renderPage", () => {
    it("wraps a registered page in the content shell followed by the site footer", () => {
        const [content, footer] = renderPage(HOME_PAGE);
        expect(content?.classList.contains(CONTENT_CLASS)).toBe(true);
        expect(content?.querySelector(`.${HOME_CLASS}`)).not.toBeNull();
        expect(footer?.classList.contains(FOOTER_CLASS)).toBe(true);
    });

    it("gives the footer the license notice only of a page that declares one", () => {
        const [, home] = renderPage(HOME_PAGE);
        const [, grammar] = renderPage(GRAMMAR_PAGE);
        expect(home?.querySelector(LICENSE_SELECTOR)).toBeNull();
        expect(grammar?.querySelector(LICENSE_SELECTOR)?.textContent).toContain(getPage(GRAMMAR_PAGE)?.license?.name);
    });

    it("gives every page, tabbed or not, one copy button that is kept out of the text it copies", () => {
        for (const page of [HOME_PAGE, GRAMMAR_PAGE]) {
            const [content] = renderPage(page);
            const buttons = content?.querySelectorAll(COPY_SELECTOR) ?? [];
            expect(buttons).toHaveLength(1);
            expect(buttons[0]?.getAttribute("title")).toBe(COPY_PAGE_TITLE);
            expect(content === undefined ? "" : exportText(content)).not.toContain(COPY_PAGE_TITLE);
        }
    });

    it("renders the missing page with a link home for an unknown id", () => {
        const [content] = renderPage(UNKNOWN);
        expect(content?.textContent).toContain(MISSING_PAGE_TITLE);
        expect(content?.querySelector("a")?.getAttribute("href")).toBe(HOME_PATH);
    });
});

describe("renderStaticPage and isStaticRender", () => {
    it("marks the document as a static render only for the duration of the render", () => {
        expect(isStaticRender()).toBe(false);
        const [content] = renderStaticPage(HOME_PAGE);
        expect(content?.classList.contains(CONTENT_CLASS)).toBe(true);
        expect(isStaticRender()).toBe(false);
        expect(document.documentElement.hasAttribute(STATIC_RENDER_ATTRIBUTE)).toBe(false);
    });
});

describe("headOf", () => {
    it("titles a registered page with the site name and carries its description", () => {
        const home = getPage(HOME_PAGE);
        const head = headOf(HOME_PAGE, home);
        expect(head.title).toContain(SITE_NAME);
        expect(head.description).toBe(home?.description);
        expect(head.path).toBe(HOME_PATH);
    });

    it("falls back to the missing-page title for an unregistered page and keeps it out of the index", () => {
        expect(headOf(UNKNOWN).title.startsWith(MISSING_PAGE_TITLE)).toBe(true);
        expect(headOf(UNKNOWN).robots).toBe(ROBOTS_NOINDEX);
        expect(headOf(HOME_PAGE, getPage(HOME_PAGE)).robots).toBe(ROBOTS_INDEX);
    });

    it("describes a secondary tab by its own path, label and opening text", () => {
        const grammar = getPage(GRAMMAR_PAGE);
        const [first, second] = GRAMMAR_TABS;
        const head = headOf(GRAMMAR_PAGE, grammar, tabLink(GRAMMAR_PAGE, second?.id ?? ""));
        expect(head.path).toBe(tabLink(GRAMMAR_PAGE, second?.id ?? ""));
        expect(head.title.startsWith(second?.label ?? "")).toBe(true);
        expect(head.description.length).toBeGreaterThan(0);
        expect(headOf(GRAMMAR_PAGE, grammar, tabLink(GRAMMAR_PAGE, first?.id ?? "")).path).toBe(pagePath(GRAMMAR_PAGE));
    });
});

describe("secondaryTab", () => {
    it("names every tab but the first, and nothing for a document page", () => {
        const grammar = getPage(GRAMMAR_PAGE);
        const home = getPage(HOME_PAGE);
        const [first, second] = GRAMMAR_TABS;
        expect(grammar === undefined ? null : secondaryTab(grammar, tabLink(GRAMMAR_PAGE, second?.id ?? ""))?.id).toBe(
            second?.id,
        );
        expect(
            grammar === undefined ? null : secondaryTab(grammar, tabLink(GRAMMAR_PAGE, first?.id ?? "")),
        ).toBeUndefined();
        expect(home === undefined ? null : secondaryTab(home, tabLink(HOME_PAGE, "anything"))).toBeUndefined();
    });
});

describe("tabHead", () => {
    it("joins the tab label, the page title and the site name", () => {
        const grammar = getPage(GRAMMAR_PAGE);
        const [, second] = GRAMMAR_TABS;
        if (grammar === undefined || second === undefined) {
            throw new Error(GRAMMAR_PAGE);
        }
        expect(tabHead(grammar, second).title).toBe(`${second.label} — ${grammar.title} — ${SITE_NAME}`);
    });
});

describe("sourceHead", () => {
    it("indexes a source page under its own path and points its alternates at the catalog leaf", () => {
        const subject = {
            alternates: { json: "/json/source/tree/a.ts", markdown: "/source/tree/a.ts.md" },
            description: "a.ts is a file in Site.",
            language: "typescript",
            license: null,
            name: "a.ts",
            path: "/anatomy/tree/file-a-ts",
            repository: null,
            tabPath: "/anatomy/tree",
            tabTitle: "Site",
            title: "Site — a.ts — Bane's Lab",
        };
        const head = sourceHead(subject);
        expect([head.path, head.title, head.description]).toStrictEqual([
            subject.path,
            subject.title,
            subject.description,
        ]);
        const root = headDocument();
        applyHead(root, head);
        const markdown = root.querySelector('link[rel="alternate"][type="text/markdown"]')?.getAttribute("href");
        expect(markdown?.endsWith(subject.alternates.markdown)).toBe(true);
    });
});

describe("applyHead", () => {
    it("writes the title, description, canonical, open graph url and type into the document head", () => {
        const root = headDocument();
        const head = headOf(HOME_PAGE, getPage(HOME_PAGE));
        applyHead(root, head);
        expect(root.title).toBe(head.title);
        expect(root.querySelector(DESCRIPTION_SLOT)?.getAttribute("content")).toBe(head.description);
        expect(root.querySelector(OG_URL_SLOT)?.getAttribute("content")).toBe(SITE_URL + HOME_PATH);
        expect(root.querySelector(OG_TYPE_SLOT)?.getAttribute("content")).toBe("website");
        expect(root.querySelector(ROBOTS_SLOT)?.getAttribute("content")).toBe(ROBOTS_INDEX);
        expect(root.querySelector(CANONICAL_SLOT)?.getAttribute("href")).toBe(SITE_URL + HOME_PATH);
        expect(JSON.parse(root.querySelector(SCHEMA_SLOT)?.textContent ?? "")).toStrictEqual(head.schema);
        applyHead(root, headOf(GRAMMAR_PAGE, getPage(GRAMMAR_PAGE)));
        expect(root.querySelector(OG_TYPE_SLOT)?.getAttribute("content")).toBe("article");
    });

    it("serves each page the share image its card renders, and the home card for an unknown page", () => {
        const home = SHARE_IMAGES.get(HOME_PAGE);
        const grammarShare = SHARE_IMAGES.get(GRAMMAR_PAGE);
        const grammar = getPage(GRAMMAR_PAGE);
        const [, second] = GRAMMAR_TABS;
        if (home === undefined || grammarShare === undefined || grammar === undefined || second === undefined) {
            throw new Error(GRAMMAR_PAGE);
        }
        const root = headDocument();
        applyHead(root, headOf(HOME_PAGE, getPage(HOME_PAGE)));
        expect(root.querySelector(OG_IMAGE_SLOT)?.getAttribute("content")).toBe(SITE_URL + home.source);
        expect(root.querySelector(TWITTER_IMAGE_SLOT)?.getAttribute("content")).toBe(SITE_URL + home.source);
        expect(root.querySelector(OG_IMAGE_ALT_SLOT)?.getAttribute("content")).toBe(home.alt);
        applyHead(root, headOf(GRAMMAR_PAGE, grammar));
        expect(root.querySelector(OG_IMAGE_SLOT)?.getAttribute("content")).toBe(SITE_URL + grammarShare.source);
        expect(tabHead(grammar, second).banner).toStrictEqual(grammarShare);
        expect(headOf(UNKNOWN).banner).toStrictEqual(home);
    });

    it("refuses loudly a page the share map holds no image for", () => {
        const home = getPage(HOME_PAGE);
        if (home === undefined) {
            throw new Error(HOME_PAGE);
        }
        expect(() => headOf(UNKNOWN, { ...home, id: UNKNOWN })).toThrow(MISSING_SHARE + UNKNOWN);
    });

    it("points the alternate links at the route's Markdown alternate and JSON payload, and drops them for an unindexed page", () => {
        const root = headDocument();
        const tab = tabLink(GRAMMAR_PAGE, GRAMMAR_TABS[1]?.id ?? "");
        applyHead(root, headOf(GRAMMAR_PAGE, getPage(GRAMMAR_PAGE), tab));
        expect(root.querySelector(MARKDOWN_ALTERNATE_SLOT)?.getAttribute("href")).toBe(
            SITE_URL + markdownTwinPath(tab),
        );
        expect(root.querySelector(JSON_ALTERNATE_SLOT)?.getAttribute("href")).toBe(SITE_URL + payloadTwinPath(tab));
        applyHead(root, headOf(UNKNOWN));
        expect(root.querySelector(MARKDOWN_ALTERNATE_SLOT)?.hasAttribute("href")).toBe(false);
        expect(root.querySelector(JSON_ALTERNATE_SLOT)?.hasAttribute("href")).toBe(false);
    });

    it("declares no video, so a platform shows the animated image rather than a player", () => {
        const root = headDocument();
        applyHead(root, headOf(HOME_PAGE, getPage(HOME_PAGE)));
        expect(root.querySelector(OG_VIDEO_SLOT)).toBeNull();
        expect(root.querySelector(OG_IMAGE_SLOT)?.getAttribute("content")?.endsWith(".gif")).toBe(true);
    });
});
