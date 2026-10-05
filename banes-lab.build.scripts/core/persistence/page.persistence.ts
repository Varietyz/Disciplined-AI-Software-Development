import {
    FULL_TEXT_ROUTE,
    PAGE_SITEMAP_ROUTE,
    SITEMAP_ROUTE,
    SOURCE_SITEMAP_ROUTE,
} from "#configuration/constants/site.constants";
import type { PageSource, SiteSource, SourcePageSource } from "#types/page.types";
import { dirname, join } from "node:path";
import { fullTextParts, fullTextRoutes } from "#core/selectors/site.selector";
import { jsonPath, ledgerFile, markdownFileOf } from "#core/resolvers/route.resolver";
import { latestStamp, stampRoutes } from "#core/converters/route.converter";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { persistLedger, readLedger } from "#core/persistence/route.persistence";
import { renderFullText, renderMarkdownPage, renderPageHtml } from "#core/formatters/page.formatter";
import {
    renderLlms,
    renderRobots,
    renderRoutePayload,
    renderSitemap,
    renderSitemapIndex,
    renderSitemapParts,
} from "#core/formatters/site.formatter";
import type { Discovery } from "#types/site.types";
import type { SourceRoute } from "#types/source.types";
import { documentPages } from "#core/converters/section.converter";
import { fileForPath } from "#core/resolvers/page.resolver";
import { llmsAppendix } from "#core/formatters/catalog.formatter";
import { rewriteEach } from "#core/adapters/document.adapter";
import { routesOf } from "#core/converters/page.converter";
import { sourceTextOf } from "#core/loaders/source.loader";
import { writeVerbatim } from "@govlab/canonical-write";

const INDEX_FILE = "index.html";
const MISSING_FILE = "404.html";
const MISSING_PAGE = "404";
const ROBOTS_FILE = "robots.txt";
const LLMS_FILE = "llms.txt";
const JSON_EXTENSION = ".json";
const PRECOMPRESSED_EXTENSIONS = [".br", ".gz"];
const SLASH = "/";

const writePage = function writePage(outDir: string, file: string, html: string): void {
    const target = join(outDir, file);
    mkdirSync(dirname(target), { recursive: true });
    writeVerbatim(target, html);
    for (const extension of PRECOMPRESSED_EXTENSIONS) {
        rmSync(target + extension, { force: true });
    }
};

export const writePages = function writePages(
    outDir: string,
    loaded: PageSource & Pick<SiteSource, "ids">,
    discovery: Discovery,
    template = readFileSync(join(outDir, INDEX_FILE), "utf8"),
): void {
    for (const route of routesOf(loaded, discovery)) {
        writePage(outDir, fileForPath(route.path), renderPageHtml(loaded, template, route));
    }
    writePage(
        outDir,
        MISSING_FILE,
        renderPageHtml(loaded, template, { page: MISSING_PAGE, path: SLASH + MISSING_PAGE }),
    );
};

export const writeSourcePages = function writeSourcePages(
    outDir: string,
    loaded: SourcePageSource,
    routes: readonly SourceRoute[],
    template = readFileSync(join(outDir, INDEX_FILE), "utf8"),
): readonly string[] {
    rewriteEach(
        template,
        routes,
        (document, route) => {
            loaded.renderer.applyHead(document, loaded.renderer.sourceHead(route.subject));
            const text = route.text === null ? null : sourceTextOf(route.text);
            document.getElementById(loaded.main)?.replaceChildren(loaded.body.renderSourceBody(route, text));
        },
        (route, html) => {
            writePage(outDir, fileForPath(route.subject.path), html);
        },
    );
    const locations = routes.map((route) => loaded.site + route.subject.path);
    return writeSitemapParts(outDir, SOURCE_SITEMAP_ROUTE, locations);
};

export const writeText = function writeText(outDir: string, file: string, text: string): void {
    const target = join(outDir, file);
    mkdirSync(dirname(target), { recursive: true });
    writeVerbatim(target, text);
};

export const writeSitemapParts = function writeSitemapParts(
    outDir: string,
    route: string,
    locations: readonly string[],
): readonly string[] {
    return renderSitemapParts(route, locations).map((part) => {
        writeText(outDir, part.route.slice(1), part.body);
        return part.route;
    });
};

export const writeSitemapIndex = function writeSitemapIndex(
    outDir: string,
    site: string,
    sitemaps: readonly (readonly [string, string | null])[],
): void {
    writeText(outDir, SITEMAP_ROUTE.slice(1), renderSitemapIndex(site, sitemaps));
};

export const writeDiscovery = async function writeDiscovery(
    outDir: string,
    discovery: Discovery,
    ledger = ledgerFile(),
): Promise<readonly [string, string | null]> {
    for (const route of discovery.routes) {
        writeText(outDir, jsonPath(route) + JSON_EXTENSION, renderRoutePayload(discovery, route));
        writeText(outDir, markdownFileOf(route.path), renderMarkdownPage(discovery.site, route));
    }
    writeText(outDir, FULL_TEXT_ROUTE, renderFullText(discovery, fullTextRoutes(discovery)));
    for (const part of fullTextParts(discovery)) {
        writeText(outDir, part.file, renderFullText(discovery, part.routes));
    }
    const stamped = stampRoutes(readLedger(ledger), discovery, new Date());
    await persistLedger(ledger, stamped.ledger);
    writeText(outDir, PAGE_SITEMAP_ROUTE.slice(1), renderSitemap(discovery, stamped.stamps));
    writeText(outDir, ROBOTS_FILE, renderRobots(discovery, [SITEMAP_ROUTE]));
    const appendix = llmsAppendix(discovery, documentPages(discovery));
    writeText(outDir, LLMS_FILE, renderLlms(discovery, appendix));
    return [PAGE_SITEMAP_ROUTE, latestStamp(stamped.ledger)];
};
