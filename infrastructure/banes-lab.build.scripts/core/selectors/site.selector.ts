import type { DiscoveredRoute, Discovery, FullTextPart } from "#types/site.types";
import { FULL_TEXT_EXTENSION, FULL_TEXT_FOLDER, REFERENCE_PAGES } from "#configuration/constants/site.constants";

const SLASH = "/";

export const isFullTextRoute = function isFullTextRoute(route: { readonly page: string }): boolean {
    return !REFERENCE_PAGES.has(route.page);
};

export const fullTextFileOf = function fullTextFileOf(page: string): string {
    return FULL_TEXT_FOLDER + SLASH + page + FULL_TEXT_EXTENSION;
};

export const fullTextRoutes = function fullTextRoutes(discovery: Discovery): readonly DiscoveredRoute[] {
    return discovery.routes.filter(isFullTextRoute);
};

export const fullTextParts = function fullTextParts(discovery: Discovery): readonly FullTextPart[] {
    return discovery.pages
        .filter((page) => isFullTextRoute({ page: page.id }))
        .map((page) => ({
            file: fullTextFileOf(page.id),
            label: page.label,
            routes: discovery.routes.filter((route) => route.page === page.id),
        }));
};

const isTab = function isTab(value: unknown): value is { readonly id: string } {
    return typeof value === "object" && value !== null && "id" in value && typeof value.id === "string";
};

export const tabContentOf = function tabContentOf(content: unknown, tab: string): unknown {
    if (typeof content !== "object" || content === null || !("tabs" in content) || !Array.isArray(content.tabs)) {
        return undefined;
    }
    return content.tabs.find((entry: unknown) => isTab(entry) && entry.id === tab);
};

export const routeOf = function routeOf(
    discovery: Discovery,
    page: string,
    tab: string | null,
): DiscoveredRoute | undefined {
    return discovery.routes.find((route) => route.page === page && route.tab === tab);
};

export const routeContentOf = function routeContentOf(discovery: Discovery, route: DiscoveredRoute): unknown {
    const page = discovery.pages.find((candidate) => candidate.id === route.page);
    return route.tab === null ? page?.content : tabContentOf(page?.content, route.tab);
};
