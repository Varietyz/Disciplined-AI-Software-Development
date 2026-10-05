import type { CatalogSource, DiscoverySource, PayloadAddress } from "#types/payload.types";
import {
    FULL_TEXT_FOLDER,
    FULL_TEXT_ROUTE,
    JSON_ROUTE,
    MARKDOWN_EXTENSION,
} from "#configuration/constants/site.constants";
import type { IncomingMessage, ServerResponse } from "node:http";
import { fullTextParts, fullTextRoutes, routeOf } from "#core/selectors/site.selector";
import { markdownRouteOf, pageIdOf, pathOf } from "#core/resolvers/payload.resolver";
import { renderFullText, renderMarkdownPage } from "#core/formatters/page.formatter";
import type { Discovery } from "#types/site.types";
import { MISSING_PAGE_ERROR } from "#configuration/strings/payload.strings";
import { renderRoutePayload } from "#core/formatters/site.formatter";

type Next = () => void;
type Handler = (request: IncomingMessage, response: ServerResponse, next: Next) => void;

const JSON_TYPE = "application/json; charset=utf-8";
const MARKDOWN_TYPE = "text/markdown; charset=utf-8";
const SLASH = "/";
const NOT_FOUND = 404;
const OK = 200;
const JSON_INDENT = 2;

const HEADERS: readonly (readonly [string, string])[] = [
    ["Access-Control-Allow-Origin", "*"],
    ["Cache-Control", "no-store"],
];

const renderMissing = function renderMissing(id: string): string {
    return `${JSON.stringify({ error: MISSING_PAGE_ERROR, id }, null, JSON_INDENT)}\n`;
};

const answer = function answer(response: ServerResponse, status: number, type: string, body: string): void {
    for (const [name, value] of HEADERS) {
        response.setHeader(name, value);
    }
    response.setHeader("Content-Type", type);
    response.statusCode = status;
    response.end(body);
};

const respondJson = async function respondJson(
    source: DiscoverySource,
    address: PayloadAddress,
    response: ServerResponse,
): Promise<void> {
    const discovery = await source();
    const route = routeOf(discovery, address.page, address.tab);
    if (route === undefined) {
        answer(response, NOT_FOUND, JSON_TYPE, renderMissing(address.page));
        return;
    }
    answer(response, OK, JSON_TYPE, renderRoutePayload(discovery, route));
};

const fullTextOf = function fullTextOf(discovery: Discovery, path: string): string | null {
    if (path === SLASH + FULL_TEXT_ROUTE) {
        return renderFullText(discovery, fullTextRoutes(discovery));
    }
    const part = fullTextParts(discovery).find((candidate) => SLASH + candidate.file === path);
    return part === undefined ? null : renderFullText(discovery, part.routes);
};

const isFullTextPath = function isFullTextPath(path: string): boolean {
    return path === SLASH + FULL_TEXT_ROUTE || path.startsWith(SLASH + FULL_TEXT_FOLDER + SLASH);
};

const respondMarkdown = async function respondMarkdown(
    source: DiscoverySource,
    path: string,
    response: ServerResponse,
    next: Next,
): Promise<void> {
    const discovery = await source();
    const full = fullTextOf(discovery, path);
    if (full !== null) {
        answer(response, OK, MARKDOWN_TYPE, full);
        return;
    }
    const route = discovery.routes.find((candidate) => candidate.path === path);
    if (route === undefined) {
        next();
        return;
    }
    answer(response, OK, MARKDOWN_TYPE, renderMarkdownPage(discovery.site, route));
};

const isRoutePath = function isRoutePath(discovery: Discovery, path: string): boolean {
    const address = pageIdOf(path);
    if (address !== null) {
        return routeOf(discovery, address.page, address.tab) !== undefined;
    }
    const markdown = markdownRouteOf(path);
    return isFullTextPath(path) || discovery.routes.some((route) => route.path === markdown);
};

const respondCatalog = async function respondCatalog(
    discoveries: DiscoverySource,
    catalog: CatalogSource,
    path: string,
    response: ServerResponse,
    next: Next,
): Promise<void> {
    if (isRoutePath(await discoveries(), path)) {
        next();
        return;
    }
    const body = (await catalog()).get(path);
    if (body === undefined) {
        next();
        return;
    }
    answer(response, OK, path.startsWith(JSON_ROUTE) ? JSON_TYPE : MARKDOWN_TYPE, body);
};

export const catalogMiddleware = function catalogMiddleware(
    discoveries: DiscoverySource,
    catalog: CatalogSource,
): Handler {
    return function serve(request, response, next): void {
        const path = pathOf(request.url ?? "");
        if (!path.startsWith(JSON_ROUTE) && !path.endsWith(MARKDOWN_EXTENSION)) {
            next();
            return;
        }
        void respondCatalog(discoveries, catalog, path, response, next);
    };
};

export const payloadMiddleware = function payloadMiddleware(source: DiscoverySource): Handler {
    return function serve(request, response, next): void {
        const url = request.url ?? "";
        const address = pageIdOf(url);
        if (address !== null) {
            void respondJson(source, address, response);
            return;
        }
        const markdown = isFullTextPath(pathOf(url)) ? pathOf(url) : markdownRouteOf(url);
        if (markdown === null) {
            next();
            return;
        }
        void respondMarkdown(source, markdown, response, next);
    };
};
