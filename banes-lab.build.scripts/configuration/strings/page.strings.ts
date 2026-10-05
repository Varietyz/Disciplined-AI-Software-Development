export const prerenderLine = function prerenderLine(routes: number, catalog: number): string {
    return `prerender: wrote ${String(routes)} route(s) with json and markdown alternates, plus 404, robots, sitemap, llms, the full text and ${String(catalog)} catalog file(s)\n`;
};

export const unregisteredPage = function unregisteredPage(page: string): string {
    return `prerender: the page id "${page}" is declared but no view registers it. Register a page record for it, or drop the id.`;
};

export const missingSectionElement = function missingSectionElement(path: string, id: string): string {
    return `prerender: ${path} renders no element for the section id "${id}".`;
};

export const emptyFigure = function emptyFigure(path: string, caption: string): string {
    return `prerender: ${path} renders the figure "${caption}" with no body, so its Markdown alternate carries only the caption. Give the figure a static form, as a diagram carries its source.`;
};

export const noSectionText = function noSectionText(path: string, count: number): string {
    return `prerender: ${path} exported no text for its ${String(count)} section(s).`;
};

export const sourceFileDescription = function sourceFileDescription(
    path: string,
    tree: string,
    summary: string,
): string {
    return `${path} is a file in ${tree}. ${summary}`;
};

export const sourceFolderDescription = function sourceFolderDescription(
    path: string,
    tree: string,
    files: number,
): string {
    return `${path} is a folder in ${tree} with ${String(files)} file${files === 1 ? "" : "s"}.`;
};

export const sourcePagesLine = function sourcePagesLine(pages: number, route: string): string {
    return `prerender: wrote ${String(pages)} source page(s) and listed them in ${route}\n`;
};

export const oversizeSitemap = function oversizeSitemap(route: string, urls: number, bytes: number): string {
    return `sitemap: ${route} holds ${String(urls)} URL(s) in ${String(bytes)} byte(s), over the 50,000 URL or 50 MB a sitemap may hold. Split it into parts listed in the sitemap index.`;
};

export const missingAlternate = function missingAlternate(path: string): string {
    return `prerender: the source page ${path} has no Markdown address for its catalog leaf.`;
};

export const unstampedRoute = function unstampedRoute(path: string): string {
    return `sitemap: route ${path} has no last-modified stamp. Run the build again so the route ledger stamps it.`;
};
