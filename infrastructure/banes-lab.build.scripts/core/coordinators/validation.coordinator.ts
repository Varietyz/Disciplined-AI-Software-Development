import {
    CATALOG_SITEMAP_ROUTE,
    FULL_TEXT_ROUTE,
    PAGE_SITEMAP_ROUTE,
    SITEMAP_ROUTE,
    SOURCE_SITEMAP_ROUTE,
} from "#configuration/constants/site.constants";
import { EMPTY_MISSING_PAGE, UNREFERENCED_FILE } from "#configuration/strings/validation.strings";
import type { Finding, Seen, ValidationRoute } from "#types/validation.types";
import { buildOutput, pageIds, readOrNull, sourcePagePaths } from "#core/loaders/build.loader";
import { buildRoutesOf, readArtifact } from "#core/converters/build.converter";
import {
    catalogFiles,
    grammarFindings,
    literalFindings,
    markdownFormFindings,
    slugFindings,
} from "#core/validators/catalog.grammar.validator";
import {
    checkAlternates,
    checkEncodings,
    checkIndexable,
    checkLinks,
    checkPage,
    checkSchema,
    checkSitemap,
    checkText,
} from "#core/validators/site.validator";
import { checkAssets, checkDiagrams } from "#core/validators/asset.validator";
import { checkFile, isServedUrl } from "#core/validators/build.validator";
import { checkMarkdown, checkPayload } from "#core/validators/payload.validator";
import { closureFindings, lookbackFindings } from "#core/validators/link.validator";
import { closureReport, graphReport, siteIndex } from "#core/resolvers/catalog.resolver";
import { fileForPath, jsonFileOf } from "#core/resolvers/page.resolver";
import { fullTextFileOf, isFullTextRoute } from "#core/selectors/site.selector";
import { jsonPathOf, markdownFileOf, markdownPathOf } from "#core/resolvers/route.resolver";
import { ANATOMY_PAGE } from "@banes-lab/web/ids/page.ids";
import { Buffer } from "node:buffer";
import { CATALOG_FILE_BUDGET } from "#configuration/constants/catalog.constants";
import { EVIDENCE_ABSENT } from "@banes-lab/content/configuration/constants/evidence.constants.ts";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";
import { catalogFindings } from "#core/validators/catalog.validator";
import { checkLinkNames } from "#core/validators/element.validator";
import { citationFindings } from "#core/validators/definition.validator";
import { graphFindings } from "#core/validators/graph.validator";
import { overBudget } from "#configuration/strings/catalog.strings";
import { schemaFindings } from "#core/validators/catalog.kind.validator";
import { sourcePageFindings } from "#core/validators/source.page.validator";
import { unreferencedFiles } from "#core/analyzers/asset.analyzer";

const MISSING_FILE = "404.html";
const ROBOTS_FILE = "robots.txt";
const SITEMAP_FILE = SITEMAP_ROUTE.slice(1);
const PAGE_SITEMAP_FILE = PAGE_SITEMAP_ROUTE.slice(1);
const LLMS_FILE = "llms.txt";
const SLASH = "/";
const RECORD_KIND = "record";

const checkRoute = function checkRoute(route: ValidationRoute, served: ReadonlySet<string>, seen: Seen): Finding[] {
    const file = fileForPath(route.path);
    const address = SITE_URL + route.path;
    const page = checkFile(file, (html) => {
        const artifact = readArtifact(html);
        return [
            ...checkPage(file, artifact, address, seen),
            ...checkIndexable(file, artifact, true),
            ...checkSchema(file, artifact, address),
            ...checkEncodings(file, artifact, isServedUrl),
            ...checkAlternates(file, artifact, {
                json: SITE_URL + jsonPathOf(route.page, route.tab),
                markdown: SITE_URL + markdownPathOf(route.path),
            }),
            ...checkLinks(file, artifact, served),
            ...checkLinkNames(file, html),
            ...checkFile(markdownFileOf(route.path), (text) =>
                checkMarkdown(markdownFileOf(route.path), text, artifact.title, address),
            ),
        ];
    });
    const json = jsonFileOf(route.page, route.tab);
    return [
        ...page,
        ...checkFile(json, (raw) => [
            ...checkPayload(json, route.page, route.tab, raw),
            ...checkDiagrams(json, raw),
            ...checkAssets(json, raw),
        ]),
    ];
};

const missingPageFindings = function missingPageFindings(): Finding[] {
    return checkFile(MISSING_FILE, (html) => {
        const artifact = readArtifact(html);
        return [
            ...(artifact.text.length > 0 ? [] : [{ file: MISSING_FILE, message: EMPTY_MISSING_PAGE }]),
            ...checkIndexable(MISSING_FILE, artifact, false),
        ];
    });
};

const fullTextPages = function fullTextPages(routes: readonly ValidationRoute[]): readonly string[] {
    return [...new Set(routes.filter(isFullTextRoute).map((route) => route.page))];
};

const fullTextFindings = function fullTextFindings(routes: readonly ValidationRoute[]): Finding[] {
    const teaching = routes.filter(isFullTextRoute).map((route) => SITE_URL + route.path);
    return [
        ...checkFile(FULL_TEXT_ROUTE, (text) => checkText(FULL_TEXT_ROUTE, text, teaching)),
        ...fullTextPages(routes).flatMap((page) => {
            const file = fullTextFileOf(page);
            const own = routes.filter((route) => route.page === page).map((route) => SITE_URL + route.path);
            return checkFile(file, (text) => {
                const bytes = Buffer.byteLength(text);
                const over =
                    bytes > CATALOG_FILE_BUDGET ? [{ file, message: overBudget(bytes, CATALOG_FILE_BUDGET) }] : [];
                return [...checkText(file, text, own), ...over];
            });
        }),
    ];
};

export const validateDiscovery = async function validateDiscovery(): Promise<Finding[]> {
    const outDir = buildOutput();
    const routes = buildRoutesOf(await pageIds(), (page) => readOrNull(jsonFileOf(page, null)));
    const sources = sourcePagePaths(ANATOMY_PAGE);
    const served = new Set([
        ...routes.map((route) => route.path),
        ...sources,
        ...routes.map((route) => markdownPathOf(route.path)),
        SLASH + LLMS_FILE,
        SLASH + FULL_TEXT_ROUTE,
        ...fullTextPages(routes).map((page) => SLASH + fullTextFileOf(page)),
        siteIndex().markdown ?? "",
    ]);
    const addresses = routes.map((route) => SITE_URL + route.path);
    const seen: Seen = { descriptions: new Set<string>(), titles: new Set<string>() };
    const listed = [
        ...addresses,
        ...routes.map((route) => SITE_URL + markdownPathOf(route.path)),
        ...routes.map((route) => SITE_URL + jsonPathOf(route.page, route.tab)),
        SITE_URL + SLASH + FULL_TEXT_ROUTE,
        ...fullTextPages(routes).map((page) => SITE_URL + SLASH + fullTextFileOf(page)),
        SITE_URL + siteIndex().json,
        SITE_URL + (siteIndex().markdown ?? ""),
        SITE_URL + CATALOG_SITEMAP_ROUTE,
        SITE_URL + SOURCE_SITEMAP_ROUTE,
    ];
    const routeFiles = new Set([
        ...routes.map((route) => jsonFileOf(route.page, route.tab)),
        ...routes.map((route) => markdownFileOf(route.path)),
    ]);
    const absent = new Set(
        EVIDENCE_ABSENT.flatMap((entry) => (entry.subject.kind === RECORD_KIND ? [entry.subject.ref] : [])),
    );
    const catalog = catalogFiles(outDir, routeFiles);
    return [
        ...catalogFindings(outDir, SITE_URL, routeFiles),
        ...grammarFindings(catalog),
        ...markdownFormFindings(),
        ...schemaFindings(outDir, catalog.json, new Set(catalog.json)),
        ...slugFindings(outDir, catalog.json),
        ...literalFindings(SITE_URL),
        ...closureFindings(closureReport()),
        ...graphFindings(graphReport()),
        ...lookbackFindings(outDir, SITE_URL, absent),
        ...routes.flatMap((route) => checkRoute(route, served, seen)),
        ...sourcePageFindings(sources, served, seen),
        ...(await citationFindings(routes)),
        ...missingPageFindings(),
        ...checkFile(PAGE_SITEMAP_FILE, (xml) => checkSitemap(PAGE_SITEMAP_FILE, xml, addresses)),
        ...checkFile(SITEMAP_FILE, (xml) =>
            checkText(SITEMAP_FILE, xml, [
                SITE_URL + PAGE_SITEMAP_ROUTE,
                SITE_URL + CATALOG_SITEMAP_ROUTE,
                SITE_URL + SOURCE_SITEMAP_ROUTE,
            ]),
        ),
        ...checkFile(ROBOTS_FILE, (text) => checkText(ROBOTS_FILE, text, [`Sitemap: ${SITE_URL}${SITEMAP_ROUTE}`])),
        ...checkFile(LLMS_FILE, (text) => checkText(LLMS_FILE, text, listed)),
        ...fullTextFindings(routes),
        ...unreferencedFiles(outDir).map((file) => ({ file, message: UNREFERENCED_FILE })),
    ];
};
