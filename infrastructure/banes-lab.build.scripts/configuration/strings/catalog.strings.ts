import { FILE_SEARCH, RECORD_SEARCH, SECTION_SEARCH } from "#configuration/constants/catalog.constants";

export const NAME_LOOKUP_TITLE = "Name lookup";

export const SEARCH_INDEX_TITLE = "Search index";

export const closureTitle = function closureTitle(contract: string): string {
    return `${contract} and the contracts it depends on`;
};

export const SCHEMA_DESCRIPTION =
    "Inferred from every file the catalog publishes at this address pattern. A field listed as required appears in each of them.";

export const unknownAddress = function unknownAddress(address: string): string {
    return `catalog: the address ${address} matches no row of the address grammar`;
};

export const indexPartTitle = function indexPartTitle(title: string, part: number, parts: number): string {
    return `${title}, part ${String(part)} of ${String(parts)}`;
};

export const overBudget = function overBudget(bytes: number, budget: number): string {
    return `The catalog file is ${String(bytes)} bytes, over the ${String(budget)}-byte budget every catalog file has to fit.`;
};

export const CANONICAL_FORM =
    "The JSON files under /json/ are the canonical form of each section, ontology record and source file. The page payloads and the Markdown versions render the same content.";

export const versionLine = function versionLine(version: number, updated: string | null, build: string): string {
    const date = updated === null ? "" : `, last changed on ${updated}`;
    return `Catalog version ${String(version)}${date}, build ${build}.`;
};

export const PAGES_INDEX_TITLE = "Pages";

export const RECORDS_INDEX_TITLE = "Ontology collections";

export const SOURCES_INDEX_TITLE = "Source trees";

export const FACETS_INDEX_TITLE = "Facets";

export const GRAMMAR_LEVELS = {
    closure: "The algorithm contracts one contract depends on, in the order they load",
    collection: "The records of one ontology collection, and the values their fields take",
    contact: "The contact details of the company",
    documentSection: "One section of a page that has no tabs",
    facetCollection: "The fields one collection can be filtered by",
    facetField: "The values one field takes, each with its record count",
    facetValue: "The records of one collection whose field has one value",
    facets: "Every ontology collection whose records can be filtered by a field",
    folder: "The files and folders of one source folder",
    ids: "Every address the site publishes, one row each",
    idsShard: "The published addresses of one group, such as one ontology collection, one row each",
    moved: "Every address the catalog published before and no longer serves, with the one that replaced it where there is one",
    numbers: "The number of every page, tab, section and captioned part, with the address it resolves to",
    page: "The tabs of one page, or its sections when it has no tabs",
    pages: "Every page of the site",
    part: "One part of an index or a section too large for a single file, holding a run of its entries or subsections in order",
    query: "The query endpoint at /q, with the parameters it reads and the limits it keeps",
    record: "One ontology record, with the records it names and the records that name it",
    records: "Every ontology collection, with its record count",
    resolve: "The record, section or file that a name, acronym or alias refers to",
    resolveMap:
        "Every name, acronym and alias with the record, section or file it refers to, and the rules that turn a name into its key",
    route: "The learning route, which puts the sections in the order the site teaches them",
    schema: "The JSON Schema of one kind of address, inferred from every file of that kind",
    search: "The search index, which names one index each for sections, ontology records and source files",
    searchKind: "The entries of one kind that the search covers, with one file of words per first letter",
    searchShard:
        "The words of one kind that start with one letter, each with the entries that contain it and how often",
    section: "One section, with its place in the learning route",
    site: "The index of every page, ontology collection and source tree",
    slugShard: "The name lookup keys that start with one letter, each with what it refers to",
    source: "One source file, with its definitions, their callers and callees, and its text",
    sources: "Every source tree",
    tab: "The sections of one tab, in reading order",
    text: "The plain text of one source file",
    tree: "The top-level files and folders of one source tree",
} as const;

export const SEARCH_KIND_LABELS: ReadonlyMap<string, string> = new Map([
    [SECTION_SEARCH, "sections"],
    [RECORD_SEARCH, "ontology records"],
    [FILE_SEARCH, "source files"],
]);

const searchKindLabel = function searchKindLabel(kind: string): string {
    const label = SEARCH_KIND_LABELS.get(kind);
    if (label === undefined) {
        throw new Error(`catalog: the search kind "${kind}" has no label. Add it to SEARCH_KIND_LABELS.`);
    }
    return label;
};

export const searchKindTitle = function searchKindTitle(kind: string): string {
    return `Search index of ${searchKindLabel(kind)}`;
};

export const searchShardTitle = function searchShardTitle(kind: string, letter: string): string {
    return `Search index entries in ${searchKindLabel(kind)} for words that start with ${letter}`;
};

export const IDS_TITLE = "Every published address";

export const CONTACT_TITLE = "Contact";

export const MOVED_TITLE = "Moved and removed addresses";

export const markdownMissing = function markdownMissing(site: string): string {
    return `Nothing is served at this address. Every address the site publishes is listed at ${site}/api.md.`;
};

export const unmatchedAddress = function unmatchedAddress(address: string): string {
    return `The catalog publishes ${address}, which matches no row of the address grammar.`;
};

export const unexampledRow = function unexampledRow(template: string): string {
    return `The address grammar names ${template}, and the catalog publishes no address of that shape.`;
};

export const unslugged = function unslugged(key: string): string {
    return `The name lookup holds the key ${key}, which the published slug rules would not produce.`;
};

export const driftedLiteral = function driftedLiteral(file: string): string {
    return `The nginx site file ${file} does not carry an answer text its strings module declares, so the two have drifted.`;
};

export const schemaShapeDefect = function schemaShapeDefect(path: string, key: string, type: string): string {
    return `The schema node ${path} carries ${key}, which applies only to the type ${type}, and its type does not admit ${type}. Infer ${key} only from values of that type.`;
};

export const schemaTypeDefect = function schemaTypeDefect(
    path: string,
    actual: string,
    allowed: readonly string[],
): string {
    return `The value at ${path} is of type ${actual}, and its schema admits only ${allowed.join(", ")}. Infer the schema from every file of this kind.`;
};

export const schemaUnrequired = function schemaUnrequired(path: string, key: string): string {
    return `The object at ${path} lacks ${key}, which its schema requires. Infer the schema from every file of this kind.`;
};

export const schemaUndeclared = function schemaUndeclared(path: string, key: string): string {
    return `The object at ${path} holds ${key}, which its schema does not declare. Infer the schema from every file of this kind.`;
};

export const noMarkdownForm = function noMarkdownForm(template: string): string {
    return `The address grammar names ${template} with no Markdown form, so a reader who asks for Markdown gets nothing. Give the address a Markdown twin.`;
};

export const emptyIndex = function emptyIndex(ref: string): string {
    return `The index ${ref} lists no entry, so a reader who opens it finds nothing to follow. Give the index the leaves it groups, or publish no index for it.`;
};

export const NOT_A_SCHEMA =
    "The schema file holds no JSON object, so no value can be checked against it. Write each schema as one object of the published dialect.";

export const missingSchema = function missingSchema(kind: string): string {
    return `The catalog publishes files of the kind ${kind} and no schema for that kind. Publish one schema per JSON address kind.`;
};

export const QUERY_TITLE = "Query endpoint";

export const undeclaredRelation = function undeclaredRelation(name: string): string {
    return `Publishes the relation ${name}, which the query contract does not list, so a walk that names it is refused. Declare the relation in the relation registry.`;
};

export const queryParametersOf = function queryParametersOf(limits: {
    readonly defaultLimit: number;
    readonly depth: number;
    readonly limit: number;
}): Readonly<Record<string, string>> {
    return {
        collection:
            "An ontology collection to filter, with each further parameter naming a field and the value it must take",
        depth: `With walk, how many steps to follow, from 1 to ${String(limits.depth)}`,
        id: "A ref pattern ending in an asterisk, matching every ref that starts with the text before it",
        kind: "With name, q or id, the one kind of entry to keep, named as in kinds",
        limit: `How many results to return, at most ${String(limits.limit)}, and ${String(limits.defaultLimit)} when the request names none`,
        name: "A name, acronym or alias, keyed the way the name lookup keys it",
        offset: "How many results to skip",
        q: "Words to search for, each of which has to appear in an entry, as a whole word, a prefix or one edit away",
        ref: "The ref of one catalog entry",
        relation: "With walk, the one relation to follow, named as in relations",
        walk: "A ref to start from, following its relation links",
    };
};

export const QUERY_MESSAGES = {
    badDepth: "The parameter depth takes a whole number from 1 to {max}.",
    badNumber: "The parameter {name} takes a whole number, and limit is at most {max}.",
    emptyValue: "The parameter {name} is empty. Give it the value to look up.",
    gone: "Nothing is served at this address any longer, because the entry it held was removed.",
    manyOperations: "One request runs one operation. Name only one of ref, name, q, collection, id and walk.",
    missing: "Nothing is served at this address.",
    noOperation: "Name one operation with ref, name, q, collection, id or walk. The parameters are listed at {index}.",
    notFound: "Nothing in the catalog matches this request.",
    staticQuery:
        "A catalog address is a static file and reads no parameters. Ask the query endpoint named in query instead.",
    unknownKind: "The catalog holds no entries of the kind {name}. The kinds are listed under kinds at {ids}.",
    unknownParameter: "This endpoint does not read the parameter {name}. The parameters are listed at {index}.",
    unknownRelation:
        "Walk does not follow a relation named {name}. The relations are listed under relations at {index}.",
} as const;

export const CATALOG_SITEMAP_LABEL = "Sitemap of every catalog address that has a Markdown version";

export const SOURCE_SITEMAP_LABEL = "Sitemap of every folder and file page in the anatomy trees";

export const ROUTE_TITLE = "Learning route";

export const NUMBERS_TITLE = "Numbers";

export const GRAMMAR_REPOSITORY_LABEL = "Grammar repository";

export const METHODOLOGY_REPOSITORY_LABEL = "Methodology repository";

export const QUERY_HEADING = "## Query";

export const DOCUMENTS_HEADING = "## Documents and contact";

export const QUERY_INTRO =
    "Besides the pages, the site gives each section, ontology record and source file its own address, so you can fetch one of them without the page it sits on. The index at /json/api lists them, and each entry carries the size of the file in bytes and a fingerprint of its content, which tells you whether it changed since you last fetched it. Each part in braces stands for an identifier.";

export const CONTACT_DESCRIPTION = "The company's registration details and email address.";

export const NO_ID_MANIFEST = "The build produced no catalog id manifest.";

export const NO_CATALOG_SITEMAP = "The build produced no sitemap for the catalog's Markdown leaves.";

export const UNLISTED_LEAF = "No catalog index lists this file; every leaf is reached from the id manifest.";

export const missingLeaf = function missingLeaf(ref: string): string {
    return `The id manifest lists ${ref}, whose leaf the build did not produce.`;
};

export const staleLeaf = function staleLeaf(ref: string): string {
    return `The id manifest records a size or fingerprint for ${ref} that the leaf does not have.`;
};

export const missingMarkdownLeaf = function missingMarkdownLeaf(ref: string): string {
    return `The id manifest lists a Markdown form of ${ref} that the build did not produce.`;
};

export const unservedAddress = function unservedAddress(address: string): string {
    return `Names ${address}, which the build does not serve.`;
};

export const unlistedInSitemap = function unlistedInSitemap(leaf: string): string {
    return `The catalog sitemap does not list ${leaf}.`;
};

export const strayInSitemap = function strayInSitemap(leaf: string): string {
    return `The catalog sitemap lists ${leaf}, which is not a catalog leaf.`;
};

export const duplicateAddress = function duplicateAddress(address: string): string {
    return `catalog: two leaves claim the address ${address}. Give one of them its own address.`;
};

export const duplicateRef = function duplicateRef(ref: string): string {
    return `catalog: two leaves claim the ref ${ref}. Give one of them its own ref.`;
};

export const reservedPageId = function reservedPageId(page: string): string {
    return `catalog: the page id "${page}" collides with a reserved catalog segment. Rename the page id.`;
};

export const unsafeSegment = function unsafeSegment(segment: string): string {
    return `catalog: the address segment "${segment}" is not a safe path segment.`;
};

export const untitledGroup = function untitledGroup(group: string): string {
    return `catalog: the address group "${group}" has no title. Add one to the group titles.`;
};

export const untitledCollection = function untitledCollection(collection: string): string {
    return `catalog: the collection "${collection}" has no title. Add one to the collection titles.`;
};

export const NO_MANIFEST_HEAD = "catalog: the id manifest head is missing, so the build has no fingerprint.";

export const nonStringValue = function nonStringValue(key: string): string {
    return `catalog: the module value ${key} is not a string.`;
};

export const noReverse = function noReverse(relation: string, from: string): string {
    return `catalog: the relation "${relation}" from ${from} has no reverse. Declare its pair in RELATION_PAIRS.`;
};

export const noRoute = function noRoute(page: string, tab: string): string {
    return `catalog: no route is registered for page "${page}" and tab "${tab}".`;
};

export const sharedSlug = function sharedSlug(
    collection: string,
    field: string,
    first: string,
    second: string,
): string {
    return `catalog: the ${collection} ${field} values "${first}" and "${second}" share one slug. Rename one of them.`;
};

export const journalFieldNotObject = function journalFieldNotObject(key: string): string {
    return `catalog journal: the ${key} field is not an object.`;
};

export const malformedJournal = function malformedJournal(key: string, refs: readonly string[]): string {
    return `catalog journal: malformed ${key} entries for ${refs.join(", ")}.`;
};

export const JOURNAL_SHAPE = "catalog journal: expected an object with refs and moved.";

export const SITE_INDEX_INTRO =
    "Each address in this index is served as JSON under /json/ and, where a Markdown version exists, at the same path with .md added. Each entry carries the size of the file in bytes and a fingerprint of its content, which tells you whether it changed since you last fetched it.";
