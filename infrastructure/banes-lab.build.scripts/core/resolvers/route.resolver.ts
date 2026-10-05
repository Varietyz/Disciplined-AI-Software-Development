import {
    JSON_ROUTE,
    MARKDOWN_EXTENSION,
    SITEMAP_EXTENSION,
    SITEMAP_PART_JOIN,
} from "#configuration/constants/site.constants";
import type { DiscoveredRoute } from "#types/site.types";
import { absolutePath } from "@ssot/paths";

const SLASH = "/";
const HOME_PATH = "/";
const HOME_STEM = "/index";

export const jsonPathOf = function jsonPathOf(id: string, tab: string | null = null): string {
    return tab === null ? JSON_ROUTE + id : JSON_ROUTE + id + SLASH + tab;
};

export const jsonPath = function jsonPath(route: DiscoveredRoute): string {
    return jsonPathOf(route.page, route.tab);
};

export const markdownPathOf = function markdownPathOf(path: string): string {
    return (path === HOME_PATH ? HOME_STEM : path) + MARKDOWN_EXTENSION;
};

export const markdownFileOf = function markdownFileOf(path: string): string {
    return markdownPathOf(path).slice(1);
};

export const sitemapPartRoute = function sitemapPartRoute(route: string, part: number): string {
    if (part === 0) {
        return route;
    }
    const stem = route.slice(0, -SITEMAP_EXTENSION.length);
    return stem + SITEMAP_PART_JOIN + String(part + 1) + SITEMAP_EXTENSION;
};

export const sitemapPartFiles = function sitemapPartFiles(
    route: string,
    exists: (file: string) => boolean,
): readonly string[] {
    const files: string[] = [];
    for (let part = 0; exists(sitemapPartRoute(route, part).slice(1)); part += 1) {
        files.push(sitemapPartRoute(route, part).slice(1));
    }
    return files;
};

export const ledgerFile = function ledgerFile(): string {
    return absolutePath("app.sitemap");
};
