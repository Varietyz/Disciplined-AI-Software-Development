import {
    CATALOG_SITEMAP_LABEL,
    CONTACT_DESCRIPTION,
    CONTACT_TITLE,
    DOCUMENTS_HEADING,
    GRAMMAR_LEVELS,
    QUERY_HEADING,
    QUERY_INTRO,
    SOURCE_SITEMAP_LABEL,
} from "#configuration/strings/catalog.strings";
import { CATALOG_SITEMAP_ROUTE, SOURCE_SITEMAP_ROUTE } from "#configuration/constants/site.constants";
import type { DiscoveredRoute, Discovery } from "#types/site.types";
import { GRAMMAR } from "#core/converters/catalog.grammar.converter";
import { contactIndex } from "#core/resolvers/catalog.resolver";

export const llmsAppendix = function llmsAppendix(
    discovery: Discovery,
    documents: readonly DiscoveredRoute[],
): readonly string[] {
    const { site } = discovery;
    const grammar = GRAMMAR.map((row) => {
        const markdown = row.address.markdown === null ? "" : `, and as Markdown at ${site}${row.address.markdown}`;
        return `- ${GRAMMAR_LEVELS[row.kind]}: ${site}${row.address.json}${markdown}`;
    });
    const pages = documents.map((route) => `- [${route.label}](${site}${route.path}): ${route.description}`);
    const contact = contactIndex();
    return [
        QUERY_HEADING,
        "",
        QUERY_INTRO,
        "",
        ...grammar,
        `- [${CATALOG_SITEMAP_LABEL}](${site}${CATALOG_SITEMAP_ROUTE})`,
        `- [${SOURCE_SITEMAP_LABEL}](${site}${SOURCE_SITEMAP_ROUTE})`,
        "",
        DOCUMENTS_HEADING,
        "",
        ...pages,
        `- [${CONTACT_TITLE}](${site}${contact.markdown ?? contact.json}): ${CONTACT_DESCRIPTION}`,
        "",
    ];
};
