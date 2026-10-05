import type { Address, GrammarData, GrammarKind, GrammarRow } from "#types/catalog.types";
import {
    FOLDER_PLACEHOLDER,
    INDEX_PART_MARK,
    PATH_PLACEHOLDER,
    SCHEMA_DIALECT,
    SCHEMA_KIND,
    SEARCH_KIND,
    SPANNING_PLACEHOLDERS,
} from "#configuration/constants/catalog.constants";
import { GRAMMAR_LEVELS, unknownAddress } from "#configuration/strings/catalog.strings";
import {
    closureLeaf,
    collectionIndex,
    contactIndex,
    facetCollectionIndex,
    facetFieldIndex,
    facetLeaf,
    facetsIndex,
    folderIndex,
    idsIndex,
    idsShard,
    indexPart,
    movedIndex,
    numbersIndex,
    pageIndex,
    pagesIndex,
    queryIndex,
    recordLeaf,
    recordsIndex,
    resolveLeaf,
    resolveMap,
    routeIndex,
    schemaLeaf,
    searchIndex,
    searchKindIndex,
    searchShard,
    sectionLeaf,
    siteIndex,
    slugShard,
    sourceLeaf,
    sourceText,
    sourcesIndex,
    treeIndex,
} from "#core/resolvers/catalog.resolver";

const PLACEHOLDER = "{";
const PLACEHOLDER_CLOSE = "}";
const SLASH = "/";
const PAGE = "{page}";
const TAB = "{tab}";
const COLLECTION = "{collection}";
const FIELD = "{field}";
const TREE = "{tree}";
const SECTION = "{section}";
const ID = "{id}";
const VALUE = "{value}";
const SLUG = "{slug}";
const KIND = "{kind}";
const LETTER = "{letter}";
const PART = "{part}";
const GROUP = "{group}";
const PART_KIND: GrammarKind = "part";
const PARTS_KEEP_KIND: ReadonlySet<GrammarKind> = new Set(["idsShard"]);

const TEXT_ADDRESS: Address = { json: sourceText(TREE, PATH_PLACEHOLDER), markdown: null };

export const GRAMMAR: readonly GrammarRow[] = [
    { address: siteIndex(), kind: "site" },
    { address: pagesIndex(), kind: "pages" },
    { address: pageIndex(PAGE), kind: "page" },
    { address: pageIndex(PAGE, TAB), kind: "tab" },
    { address: sectionLeaf(PAGE, TAB, SECTION), kind: "section" },
    { address: sectionLeaf(PAGE, null, SECTION), kind: "documentSection" },
    { address: indexPart(sectionLeaf(PAGE, TAB, SECTION), PART), kind: PART_KIND },
    { address: recordsIndex(), kind: "records" },
    { address: collectionIndex(COLLECTION), kind: "collection" },
    { address: indexPart(collectionIndex(COLLECTION), PART), kind: PART_KIND },
    { address: recordLeaf(COLLECTION, ID), kind: "record" },
    { address: closureLeaf(COLLECTION, ID), kind: "closure" },
    { address: facetsIndex(), kind: "facets" },
    { address: facetCollectionIndex(COLLECTION), kind: "facetCollection" },
    { address: facetFieldIndex(COLLECTION, FIELD), kind: "facetField" },
    { address: facetLeaf(COLLECTION, FIELD, VALUE), kind: "facetValue" },
    { address: resolveLeaf(SLUG), kind: "resolve" },
    { address: resolveMap(), kind: "resolveMap" },
    { address: slugShard(LETTER), kind: "slugShard" },
    { address: sourcesIndex(), kind: "sources" },
    { address: treeIndex(TREE), kind: "tree" },
    { address: folderIndex(TREE, FOLDER_PLACEHOLDER), kind: "folder" },
    { address: sourceLeaf(TREE, PATH_PLACEHOLDER), kind: "source" },
    { address: TEXT_ADDRESS, kind: "text" },
    { address: routeIndex(), kind: "route" },
    { address: numbersIndex(), kind: "numbers" },
    { address: searchIndex(), kind: SEARCH_KIND },
    { address: searchKindIndex(KIND), kind: "searchKind" },
    { address: searchShard(KIND, LETTER), kind: "searchShard" },
    { address: idsIndex(), kind: "ids" },
    { address: idsShard(GROUP), kind: "idsShard" },
    { address: movedIndex(), kind: "moved" },
    { address: queryIndex(), kind: "query" },
    { address: schemaLeaf(KIND), kind: "schema" },
    { address: contactIndex(), kind: "contact" },
];

const segmentMatches = function segmentMatches(pattern: string, value: string): boolean {
    const open = pattern.indexOf(PLACEHOLDER);
    if (open === -1) {
        return pattern === value;
    }
    const prefix = pattern.slice(0, open);
    const suffix = pattern.slice(pattern.indexOf(PLACEHOLDER_CLOSE, open) + 1);
    return value.length > prefix.length + suffix.length && value.startsWith(prefix) && value.endsWith(suffix);
};

const spans = function spans(pattern: string): boolean {
    const open = pattern.indexOf(PLACEHOLDER);
    return open !== -1 && SPANNING_PLACEHOLDERS.has(pattern.slice(open, pattern.indexOf(PLACEHOLDER_CLOSE, open) + 1));
};

const segmentsMatch = function segmentsMatch(
    patterns: readonly string[],
    values: readonly string[],
    at: { readonly pattern: number; readonly value: number },
): boolean {
    if (at.pattern === patterns.length) {
        return at.value === values.length;
    }
    const pattern = patterns.at(at.pattern) ?? "";
    const last = spans(pattern) ? values.length : Math.min(at.value + 1, values.length);
    for (let end = at.value + 1; end <= last; end += 1) {
        const consumed = values.slice(at.value, end).join(SLASH);
        if (
            segmentMatches(pattern, consumed) &&
            segmentsMatch(patterns, values, { pattern: at.pattern + 1, value: end })
        ) {
            return true;
        }
    }
    return false;
};

export const matchesTemplate = function matchesTemplate(template: string, path: string): boolean {
    return segmentsMatch(template.split(SLASH), path.split(SLASH), { pattern: 0, value: 0 });
};

const literalLength = function literalLength(template: string): number {
    let length = 0;
    let inside = false;
    for (const char of template) {
        inside = char === PLACEHOLDER || (inside && char !== PLACEHOLDER_CLOSE);
        length += inside || char === PLACEHOLDER_CLOSE ? 0 : 1;
    }
    return length;
};

const closestKind = function closestKind(path: string): GrammarKind | null {
    const matching = GRAMMAR.filter((row) => matchesTemplate(row.address.json, path));
    const ranked = matching.toSorted(
        (left, right) => literalLength(right.address.json) - literalLength(left.address.json),
    );
    return ranked.at(0)?.kind ?? null;
};

export const kindOrNull = function kindOrNull(path: string): GrammarKind | null {
    const last = path.slice(path.lastIndexOf(SLASH) + 1);
    const base = last.startsWith(INDEX_PART_MARK) ? path.slice(0, path.lastIndexOf(SLASH)) : null;
    const kind = closestKind(base ?? path);
    if (kind === null) {
        return null;
    }
    return base === null || PARTS_KEEP_KIND.has(kind) ? kind : PART_KIND;
};

export const kindOfAddress = function kindOfAddress(path: string): GrammarKind {
    const kind = kindOrNull(path);
    if (kind === null) {
        throw new Error(unknownAddress(path));
    }
    return kind;
};

export const grammarRows = function grammarRows(published: readonly string[]): readonly GrammarData[] {
    const served = new Set(published);
    return GRAMMAR.map((row) => {
        const template = row.address.json.includes(PLACEHOLDER);
        const schema = schemaLeaf(row.kind).json;
        const described = served.has(schema) ? schema : null;
        return {
            example: template ? (published.find((path) => matchesTemplate(row.address.json, path)) ?? null) : null,
            json: row.address.json,
            kind: row.kind,
            level: GRAMMAR_LEVELS[row.kind],
            markdown: row.address.markdown,
            schema: row.kind === SCHEMA_KIND ? SCHEMA_DIALECT : described,
            template,
        };
    });
};
