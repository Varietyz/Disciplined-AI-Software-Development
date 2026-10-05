import { AI_AGENTS, FULL_TEXT_ROUTE, SITEMAP_BYTE_CAP, SITEMAP_URL_CAP } from "#configuration/constants/site.constants";
import type { DiscoveredRoute, Discovery, SitemapPart } from "#types/site.types";
import {
    LLMS_FULL_TEXT_LABEL,
    LLMS_JSON_HEADING,
    LLMS_JSON_INTRO,
    LLMS_MARKDOWN_HEADING,
    LLMS_MARKDOWN_INTRO,
    LLMS_PAGES_HEADING,
    LLMS_USE_HEADING,
    trainingConsent,
} from "#configuration/strings/site.strings";
import { fullTextParts, routeContentOf } from "#core/selectors/site.selector";
import { jsonPath, markdownPathOf, sitemapPartRoute } from "#core/resolvers/route.resolver";
import { oversizeSitemap, unstampedRoute } from "#configuration/strings/page.strings";
import { Buffer } from "node:buffer";

const SLASH = "/";
const JSON_INDENT = 2;
const SITEMAP_OPEN =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const SITEMAP_CLOSE = "</urlset>\n";
const SITEMAP_INDEX_OPEN =
    '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const SITEMAP_INDEX_CLOSE = "</sitemapindex>\n";
const XML_ESCAPES: ReadonlyMap<string, string> = new Map([
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', "&quot;"],
    ["'", "&apos;"],
]);

export const escapeXml = function escapeXml(value: string): string {
    let out = "";
    for (const char of value) {
        out += XML_ESCAPES.get(char) ?? char;
    }
    return out;
};

export const isoDate = function isoDate(moment: Date): string {
    return moment.toISOString().slice(0, "YYYY-MM-DD".length);
};

export const renderPayload = function renderPayload(site: string, route: DiscoveredRoute, content: unknown): string {
    const payload = {
        content,
        description: route.description,
        id: route.page,
        label: route.label,
        tab: route.tab,
        title: route.title,
        url: site + route.path,
    };
    return `${JSON.stringify(payload, null, JSON_INDENT)}\n`;
};

export const renderRoutePayload = function renderRoutePayload(discovery: Discovery, route: DiscoveredRoute): string {
    return renderPayload(discovery.site, route, routeContentOf(discovery, route));
};

const urlEntry = function urlEntry(location: string, stamp: string | null): string {
    const lastmod = stamp === null ? "" : `\n    <lastmod>${stamp}</lastmod>`;
    return `  <url>\n    <loc>${escapeXml(location)}</loc>${lastmod}\n  </url>`;
};

export const renderSitemap = function renderSitemap(discovery: Discovery, stamps: ReadonlyMap<string, string>): string {
    const entries = discovery.routes.map((route) => {
        const stamp = stamps.get(route.path);
        if (stamp === undefined) {
            throw new Error(unstampedRoute(route.path));
        }
        return urlEntry(discovery.site + route.path, stamp);
    });
    return [SITEMAP_OPEN, ...entries, SITEMAP_CLOSE].join("\n");
};

export const renderSitemapIndex = function renderSitemapIndex(
    site: string,
    sitemaps: readonly (readonly [string, string | null])[],
): string {
    const entries = sitemaps.map(([path, stamp]) => {
        const lastmod = stamp === null ? "" : `\n    <lastmod>${stamp}</lastmod>`;
        return `  <sitemap>\n    <loc>${escapeXml(site + path)}</loc>${lastmod}\n  </sitemap>`;
    });
    return [SITEMAP_INDEX_OPEN, ...entries, SITEMAP_INDEX_CLOSE].join("\n");
};

export const renderUrlSet = function renderUrlSet(locations: readonly string[]): string {
    return [SITEMAP_OPEN, ...locations.map((location) => urlEntry(location, null)), SITEMAP_CLOSE].join("\n");
};

export const renderSitemapParts = function renderSitemapParts(
    route: string,
    locations: readonly string[],
): readonly SitemapPart[] {
    const count = Math.max(1, Math.ceil(locations.length / SITEMAP_URL_CAP));
    return Array.from({ length: count }, (_, part) => {
        const listed = locations.slice(part * SITEMAP_URL_CAP, (part + 1) * SITEMAP_URL_CAP);
        const body = renderUrlSet(listed);
        const partRoute = sitemapPartRoute(route, part);
        const bytes = Buffer.byteLength(body);
        if (bytes > SITEMAP_BYTE_CAP) {
            throw new Error(oversizeSitemap(partRoute, listed.length, bytes));
        }
        return { body, route: partRoute };
    });
};

export const renderRobots = function renderRobots(discovery: Discovery, sitemapPaths: readonly string[]): string {
    const { author, consent, site } = discovery;
    const agents = AI_AGENTS.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]);
    return [
        `# ${trainingConsent(consent, author, site)}`,
        "",
        "User-agent: *",
        "Allow: /",
        "",
        ...agents,
        ...sitemapPaths.map((path) => `Sitemap: ${site}${path}`),
        "",
    ].join("\n");
};

export const renderLlms = function renderLlms(discovery: Discovery, appendix: readonly string[]): string {
    const links = discovery.routes.map(
        (route) => `- [${route.label}](${discovery.site}${route.path}): ${route.description}`,
    );
    const texts = discovery.routes.map((route) => `- [${route.label}](${discovery.site}${markdownPathOf(route.path)})`);
    const payloads = discovery.routes.map((route) => `- [${route.label}](${discovery.site}${jsonPath(route)})`);
    return [
        `# ${discovery.name}`,
        "",
        `> ${discovery.summary}`,
        "",
        LLMS_PAGES_HEADING,
        "",
        ...links,
        "",
        LLMS_MARKDOWN_HEADING,
        "",
        LLMS_MARKDOWN_INTRO,
        "",
        `- [${LLMS_FULL_TEXT_LABEL}](${discovery.site}${SLASH}${FULL_TEXT_ROUTE})`,
        ...fullTextParts(discovery).map(
            (part) => `- [${LLMS_FULL_TEXT_LABEL}: ${part.label}](${discovery.site}${SLASH}${part.file})`,
        ),
        ...texts,
        "",
        LLMS_JSON_HEADING,
        "",
        LLMS_JSON_INTRO,
        "",
        ...payloads,
        "",
        ...appendix,
        LLMS_USE_HEADING,
        "",
        trainingConsent(discovery.consent, discovery.author, discovery.site),
        "",
    ].join("\n");
};
