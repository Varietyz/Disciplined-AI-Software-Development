import type { Entry, GrammarData, Identity, SiteData } from "#types/catalog.types";
import type { FacetSummary, IndexData, IndexPart } from "#types/index.types";
import { SITE_INDEX_INTRO, versionLine } from "#configuration/strings/catalog.strings";
import { addressLines, blocks, code, heading, quote, section } from "#core/formatters/markdown.formatter";
import { siteIndex } from "#core/resolvers/catalog.resolver";

const SEPARATOR = ", ";
const SUMMARY_JOINER = ": ";

const entryLine = function entryLine(entry: Entry): string {
    const target = entry.markdown ?? entry.json;
    const summary = entry.summary === null ? "" : SUMMARY_JOINER + entry.summary;
    return `[${entry.title}](${target})${summary}`;
};

const partLine = function partLine(part: IndexPart): string {
    return `[${part.first} to ${part.last}](${part.markdown ?? part.json}) (${String(part.count)})`;
};

const facetsOf = function facetsOf(facets: readonly FacetSummary[]): readonly string[] {
    const fields = new Map<string, string[]>();
    for (const facet of facets) {
        const line = `[${facet.value}](${facet.markdown}) (${String(facet.count)})`;
        fields.set(facet.field, [...(fields.get(facet.field) ?? []), line]);
    }
    return [...fields.entries()].map(([field, values]) => `${code(field)}: ${values.join(SEPARATOR)}`);
};

export const renderIndex = function renderIndex(
    identity: Identity,
    data: IndexData,
    entries: readonly Entry[],
    site: string,
): string {
    const alternate = data.alternate ?? null;
    return blocks([
        heading(identity.title),
        quote(identity.summary),
        addressLines([
            ["Canonical", identity.href === null ? null : site + identity.href],
            ["Page as Markdown", alternate?.markdown ?? null],
            ["Page as JSON", alternate?.json ?? null],
            ["This index as JSON", site + identity.address.json],
        ]),
        section("Fields", facetsOf(data.facets ?? [])),
        section("Parts", (data.parts ?? []).map(partLine)),
        section("Entries", entries.map(entryLine)),
    ]);
};

const grammarLine = function grammarLine(row: GrammarData): string {
    const markdown = row.markdown === null ? "" : ` or ${code(row.markdown)}`;
    return `${row.level}: ${code(row.json)}${markdown}`;
};

export const renderSiteIndex = function renderSiteIndex(data: SiteData, site: string): string {
    return blocks([
        heading(data.title),
        quote(data.summary),
        SITE_INDEX_INTRO,
        data.canonical,
        versionLine(data.version, data.updated, data.build),
        section("Address patterns", data.grammar.map(grammarLine)),
        section("Pages", data.pages.map(entryLine)),
        section("Documents", data.documents.map(entryLine)),
        section("Ontology records", data.collections.map(entryLine)),
        section("Source trees", data.trees.map(entryLine)),
        section("Other indexes", data.queries.map(entryLine)),
        `## Use and attribution\n\n${data.consent}`,
        addressLines([["This index as JSON", site + siteIndex().json]]),
    ]);
};
