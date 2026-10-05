import {
    AI_AGENTS,
    CATALOG_SITEMAP_ROUTE,
    FULL_TEXT_ROUTE,
    JSON_ROUTE,
    SITEMAP_ROUTE,
    SITEMAP_URL_CAP,
} from "@banes-lab/build-scripts/configuration/constants/site.constants.ts";
import { AUTHOR, CONSENT, DISCOVERY, GUIDE, GUIDE_TAB, SITE, TERMS } from "../converters/site.fixture.ts";
import { describe, expect, it } from "vitest";
import {
    escapeXml,
    isoDate,
    renderLlms,
    renderPayload,
    renderRobots,
    renderRoutePayload,
    renderSitemap,
    renderSitemapIndex,
    renderSitemapParts,
    renderUrlSet,
} from "@banes-lab/build-scripts/core/formatters/site.formatter.ts";
import { trainingConsent } from "@banes-lab/build-scripts/configuration/strings/site.strings.ts";

const MOMENT = new Date("2026-09-19T14:00:00Z");
const STAMP = "2026-09-19";

describe("renderPayload", () => {
    it("serializes the route identity, its own label, its address, its tab and the content it was handed", () => {
        const parsed: unknown = JSON.parse(renderPayload(SITE, GUIDE, GUIDE_TAB));
        expect(parsed).toStrictEqual({
            content: GUIDE_TAB,
            description: "The guide tab.",
            id: "terms",
            label: "Guide",
            tab: "guide",
            title: "Guide — Terms — Example",
            url: `${SITE}/terms/guide`,
        });
    });
});

describe("renderRoutePayload", () => {
    it("hands a page route its whole content and a tab route that tab alone", () => {
        expect(JSON.parse(renderRoutePayload(DISCOVERY, TERMS))).toMatchObject({ content: TERMS.content, tab: null });
        expect(JSON.parse(renderRoutePayload(DISCOVERY, GUIDE))).toMatchObject({ content: GUIDE_TAB, tab: "guide" });
    });
});

describe("escapeXml", () => {
    it("escapes the five xml metacharacters and leaves the rest alone", () => {
        expect(escapeXml(`a&b<c>"d'`)).toBe("a&amp;b&lt;c&gt;&quot;d&apos;");
    });
});

describe("isoDate", () => {
    it("keeps the calendar date only", () => {
        expect(isoDate(MOMENT)).toBe(STAMP);
    });
});

describe("renderSitemap", () => {
    it("lists every route, tabs included, as an absolute location with its own last-modified stamp, and refuses a route without one", () => {
        const stamps = new Map(
            DISCOVERY.routes.map((route) => [route.path, route.path === "/terms/guide" ? "2025-01-02" : STAMP]),
        );
        const xml = renderSitemap(DISCOVERY, stamps);
        expect(xml).toContain(`<loc>${SITE}/terms</loc>\n    <lastmod>${STAMP}</lastmod>`);
        expect(xml).toContain(`<loc>${SITE}/terms/guide</loc>\n    <lastmod>2025-01-02</lastmod>`);
        expect(xml.startsWith("<?xml")).toBe(true);
        expect(() => renderSitemap(DISCOVERY, new Map())).toThrow("/");
    });
});

describe("renderRobots", () => {
    it("allows every agent, names each AI agent explicitly, states the consent and points at every sitemap", () => {
        const robots = renderRobots(DISCOVERY, [SITEMAP_ROUTE, CATALOG_SITEMAP_ROUTE]);
        expect(robots).toContain("User-agent: *");
        expect(robots).toContain(`# ${trainingConsent(CONSENT, AUTHOR, SITE)}`);
        expect(robots).toContain(`# ${CONSENT} `);
        expect(robots).toContain(`attribute it to ${AUTHOR}`);
        for (const agent of AI_AGENTS) {
            expect(robots).toContain(`User-agent: ${agent}\nAllow: /`);
        }
        expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml\nSitemap: ${SITE}/sitemap-catalog.xml`);
    });
});

describe("renderSitemapIndex", () => {
    it("names each sitemap by its absolute address, with a last-modified stamp where one is known", () => {
        const xml = renderSitemapIndex(SITE, [
            ["/sitemap-pages.xml", STAMP],
            ["/sitemap-catalog.xml", null],
        ]);
        expect(xml).toContain("<sitemapindex");
        expect(xml).toContain(`<loc>${SITE}/sitemap-pages.xml</loc>\n    <lastmod>${STAMP}</lastmod>`);
        expect(xml).toContain(`<loc>${SITE}/sitemap-catalog.xml</loc>\n  </sitemap>`);
    });
});

describe("renderUrlSet", () => {
    it("lists each location it is handed, escaped, without a last-modified stamp", () => {
        const xml = renderUrlSet([`${SITE}/a.md`, `${SITE}/b&c.md`]);
        expect(xml.startsWith("<?xml")).toBe(true);
        expect(xml).toContain(`<loc>${SITE}/a.md</loc>`);
        expect(xml).toContain(`<loc>${SITE}/b&amp;c.md</loc>`);
        expect(xml).not.toContain("<lastmod>");
    });
});

describe("renderLlms", () => {
    it("places the appendix it is handed before the attribution section", () => {
        const text = renderLlms(DISCOVERY, ["## Query", "", "- the root index", ""]);
        expect(text.indexOf("## Query")).toBeGreaterThan(text.indexOf("## JSON"));
        expect(text.indexOf("## Query")).toBeLessThan(text.indexOf("## Use and Attribution"));
    });

    it("opens with the site name and summary and links every route as a page, a markdown alternate and a payload", () => {
        const text = renderLlms(DISCOVERY, []);
        expect(text.startsWith("# Example")).toBe(true);
        expect(text).toContain("> An example site.");
        expect(text).toContain(`- [Terms](${SITE}/terms): Terms & conditions.`);
        expect(text).toContain(`- [Guide](${SITE}/terms/guide): The guide tab.`);
        expect(text).toContain(`- [Guide](${SITE}/terms/guide.md)`);
        expect(text).toContain(`- [Home](${SITE}/index.md)`);
        expect(text).toContain(`- [Full text](${SITE}/${FULL_TEXT_ROUTE})`);
        expect(text).toContain(`- [Terms](${SITE}${JSON_ROUTE}terms)`);
        expect(text).toContain(`- [Guide](${SITE}${JSON_ROUTE}terms/guide)`);
        expect(text).toContain(trainingConsent(CONSENT, AUTHOR, SITE));
    });
});

describe("renderSitemapParts", () => {
    it("keeps a sitemap within the cap as one part and splits a longer one into numbered parts", () => {
        const [single] = renderSitemapParts("/sitemap-a.xml", [`${SITE}/a`]);
        expect(single?.route).toBe("/sitemap-a.xml");
        expect(single?.body).toContain(`<loc>${SITE}/a</loc>`);
        const over = Array.from({ length: SITEMAP_URL_CAP + 1 }, (_, index) => `${SITE}/${String(index)}`);
        const parts = renderSitemapParts("/sitemap-a.xml", over);
        expect(parts.map((part) => part.route)).toStrictEqual(["/sitemap-a.xml", "/sitemap-a-2.xml"]);
        expect(parts[1]?.body).toContain(`<loc>${SITE}/${String(SITEMAP_URL_CAP)}</loc>`);
        expect(renderSitemapParts("/sitemap-a.xml", []).map((part) => part.route)).toStrictEqual(["/sitemap-a.xml"]);
    });
});
