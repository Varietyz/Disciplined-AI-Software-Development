import type { DiscoveredRoute, Discovery } from "#types/site.types";
import type { PageRoute, PageSource } from "#types/page.types";
import { rewriteDocument } from "#core/adapters/document.adapter";
import { trainingConsent } from "#configuration/strings/site.strings";

const SEPARATOR = "\n\n---\n\n";
const BLANK = "\n\n";
const LINE_END = "\n";
const HEADING_MARK = "# ";
const QUOTE_MARK = "> ";
const CANONICAL_LABEL = "Canonical: ";

const withLineEnd = function withLineEnd(parts: readonly string[], joint: string): string {
    return parts.join(joint) + LINE_END;
};

export const renderMarkdownPage = function renderMarkdownPage(site: string, route: DiscoveredRoute): string {
    const heading = HEADING_MARK + route.title;
    const summary = QUOTE_MARK + route.description;
    const canonical = CANONICAL_LABEL + site + route.path;
    return withLineEnd([heading, summary, canonical, route.markdown], BLANK);
};

export const renderFullText = function renderFullText(
    discovery: Discovery,
    routes: readonly DiscoveredRoute[],
): string {
    const pages = routes.map((route) => renderMarkdownPage(discovery.site, route).trimEnd());
    const heading = HEADING_MARK + discovery.name;
    const summary = QUOTE_MARK + discovery.summary;
    const consent = trainingConsent(discovery.consent, discovery.author, discovery.site);
    return withLineEnd([heading, summary, consent, ...pages], SEPARATOR);
};

export const renderPageHtml = function renderPageHtml(loaded: PageSource, template: string, route: PageRoute): string {
    loaded.visit(route.path);
    return rewriteDocument(template, (root) => {
        loaded.renderer.applyHead(
            root,
            loaded.renderer.headOf(route.page, loaded.registry.loadedPage(route.page), route.path),
        );
        root.getElementById(loaded.main)?.replaceChildren(...loaded.renderer.renderStaticPage(route.page));
    });
};
