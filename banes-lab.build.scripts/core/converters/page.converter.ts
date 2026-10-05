import type { PageRoute, SiteSource } from "#types/page.types";
import type { Discovery } from "#types/site.types";
import { definitionOf } from "#core/selectors/page.selector";

const SLASH = "/";

export const routesOf = function routesOf(
    loaded: Pick<SiteSource, "ids" | "registry" | "renderer">,
    discovery: Discovery,
): PageRoute[] {
    const pages = loaded.ids.map((page) => ({
        page,
        path: loaded.renderer.headOf(page, definitionOf(loaded, page)).path,
    }));
    const tabs = discovery.routes
        .filter((route) => !pages.some((page) => page.path === route.path))
        .map((route) => ({ page: route.path.split(SLASH)[1] ?? "", path: route.path }));
    return [...pages, ...tabs];
};
