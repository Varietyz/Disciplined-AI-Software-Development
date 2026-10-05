import {
    API_SEGMENT,
    CLOSURE_SEGMENT,
    CONTACT_SEGMENT,
    FACETS_SEGMENT,
    IDS_SEGMENT,
    INDEX_PART_MARK,
    MOVED_SEGMENT,
    NUMBERS_SEGMENT,
    PAGES_SEGMENT,
    QUERY_SEGMENT,
    RECORDS_SEGMENT,
    RESOLVE_SEGMENT,
    ROUTE_SEGMENT,
    SCHEMA_SEGMENT,
    SEARCH_SEGMENT,
    SLUGS_SEGMENT,
    SOURCE_SEGMENT,
    TEXT_EXTENSION,
} from "#configuration/constants/catalog.constants";
import { JSON_ROUTE, MARKDOWN_EXTENSION } from "#configuration/constants/site.constants";
import type { Address } from "#types/catalog.types";
import { absolutePath } from "@ssot/paths";
import { unsafeSegment } from "#configuration/strings/catalog.strings";

const SLASH = "/";
const JSON_EXTENSION = ".json";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SEGMENT_MARKS = "-_.";
const SAFE = LOWER + UPPER + DIGITS + SEGMENT_MARKS;

const PLACEHOLDER_OPEN = "{";
const PLACEHOLDER_CLOSE = "}";

const isSafeText = function isSafeText(text: string): boolean {
    if (text.length === 0 || text === "." || text === "..") {
        return false;
    }
    for (let at = 0; at < text.length; at += 1) {
        if (!SAFE.includes(text.charAt(at))) {
            return false;
        }
    }
    return true;
};

const isSafeSegment = function isSafeSegment(segment: string): boolean {
    const placeholder = segment.startsWith(PLACEHOLDER_OPEN) && segment.endsWith(PLACEHOLDER_CLOSE);
    return isSafeText(placeholder ? segment.slice(1, -1) : segment);
};

export const joined = function joined(segments: readonly string[]): string {
    for (const segment of segments) {
        if (!isSafeSegment(segment)) {
            throw new Error(unsafeSegment(segment));
        }
    }
    return SLASH + segments.join(SLASH);
};

const address = function address(segments: readonly string[], markdown: boolean): Address {
    const path = joined(segments);
    return { json: JSON_ROUTE.slice(0, -1) + path, markdown: markdown ? path + MARKDOWN_EXTENSION : null };
};

export const siteIndex = function siteIndex(): Address {
    return address([API_SEGMENT], true);
};

export const pageIndex = function pageIndex(page: string, tab: string | null = null): Address {
    return address(tab === null ? [API_SEGMENT, PAGES_SEGMENT, page] : [API_SEGMENT, PAGES_SEGMENT, page, tab], true);
};

export const sectionLeaf = function sectionLeaf(page: string, tab: string | null, section: string): Address {
    return address(tab === null ? [page, section] : [page, tab, section], true);
};

export const collectionIndex = function collectionIndex(collection: string): Address {
    return address([API_SEGMENT, RECORDS_SEGMENT, collection], true);
};

export const recordLeaf = function recordLeaf(collection: string, id: string): Address {
    return address([RECORDS_SEGMENT, collection, id], true);
};

export const closureLeaf = function closureLeaf(collection: string, id: string): Address {
    return address([RECORDS_SEGMENT, collection, id, CLOSURE_SEGMENT], true);
};

export const facetLeaf = function facetLeaf(collection: string, field: string, value: string): Address {
    return address([API_SEGMENT, FACETS_SEGMENT, collection, field, value], true);
};

export const resolveMap = function resolveMap(): Address {
    return address([API_SEGMENT, RESOLVE_SEGMENT], true);
};

export const resolveLeaf = function resolveLeaf(slug: string): Address {
    return address([API_SEGMENT, RESOLVE_SEGMENT, slug], true);
};

export const treeIndex = function treeIndex(tree: string): Address {
    return address([API_SEGMENT, SOURCE_SEGMENT, tree], true);
};

export const pagesIndex = function pagesIndex(): Address {
    return address([API_SEGMENT, PAGES_SEGMENT], true);
};

export const recordsIndex = function recordsIndex(): Address {
    return address([API_SEGMENT, RECORDS_SEGMENT], true);
};

export const sourcesIndex = function sourcesIndex(): Address {
    return address([API_SEGMENT, SOURCE_SEGMENT], true);
};

export const facetsIndex = function facetsIndex(): Address {
    return address([API_SEGMENT, FACETS_SEGMENT], true);
};

export const facetCollectionIndex = function facetCollectionIndex(collection: string): Address {
    return address([API_SEGMENT, FACETS_SEGMENT, collection], true);
};

export const facetFieldIndex = function facetFieldIndex(collection: string, field: string): Address {
    return address([API_SEGMENT, FACETS_SEGMENT, collection, field], true);
};

const safeSegmentOf = function safeSegmentOf(segment: string): string {
    if (isSafeSegment(segment)) {
        return segment;
    }
    let kept = "";
    for (let at = 0; at < segment.length; at += 1) {
        kept += SAFE.includes(segment.charAt(at)) ? segment.charAt(at) : "";
    }
    return kept;
};

export const sourceLeaf = function sourceLeaf(tree: string, path: string): Address {
    return address([SOURCE_SEGMENT, tree, ...path.split(SLASH).map(safeSegmentOf)], true);
};

export const folderIndex = function folderIndex(tree: string, path: string): Address {
    return address([API_SEGMENT, SOURCE_SEGMENT, tree, ...path.split(SLASH).map(safeSegmentOf)], true);
};

export const treeAddressRoots = function treeAddressRoots(tree: string): readonly string[] {
    return [address([API_SEGMENT, SOURCE_SEGMENT, tree], false).json, address([SOURCE_SEGMENT, tree], false).json];
};

export const retabbedAddress = function retabbedAddress(json: string, from: string, to: string): string | null {
    const targets = treeAddressRoots(to);
    const pair = treeAddressRoots(from)
        .map((source, index) => ({ source, target: targets.at(index) }))
        .find(({ source }) => json === source || json.startsWith(source + SLASH));
    return pair?.target === undefined ? null : pair.target + json.slice(pair.source.length);
};

export const sourceText = function sourceText(tree: string, path: string): string {
    return joined([SOURCE_SEGMENT, tree, ...path.split(SLASH).map(safeSegmentOf)]) + TEXT_EXTENSION;
};

export const routeIndex = function routeIndex(): Address {
    return address([API_SEGMENT, ROUTE_SEGMENT], true);
};

export const numbersIndex = function numbersIndex(): Address {
    return address([API_SEGMENT, NUMBERS_SEGMENT], true);
};

export const idsIndex = function idsIndex(): Address {
    return address([API_SEGMENT, IDS_SEGMENT], true);
};

export const searchIndex = function searchIndex(): Address {
    return address([API_SEGMENT, SEARCH_SEGMENT], true);
};

export const idsShard = function idsShard(group: string): Address {
    return address([API_SEGMENT, IDS_SEGMENT, group], true);
};

export const indexPart = function indexPart(base: Address, part: string): Address {
    const segment = SLASH + INDEX_PART_MARK + part;
    const markdown =
        base.markdown === null
            ? null
            : base.markdown.slice(0, -MARKDOWN_EXTENSION.length) + segment + MARKDOWN_EXTENSION;
    return { json: base.json + segment, markdown };
};

export const searchKindIndex = function searchKindIndex(kind: string): Address {
    return address([API_SEGMENT, SEARCH_SEGMENT, kind], true);
};

export const searchShard = function searchShard(kind: string, prefix: string): Address {
    return address([API_SEGMENT, SEARCH_SEGMENT, kind, prefix], true);
};

export const slugShard = function slugShard(prefix: string): Address {
    return address([API_SEGMENT, SLUGS_SEGMENT, prefix], true);
};

export const queryIndex = function queryIndex(): Address {
    return address([API_SEGMENT, QUERY_SEGMENT], true);
};

export const movedIndex = function movedIndex(): Address {
    return address([API_SEGMENT, MOVED_SEGMENT], true);
};

export const schemaLeaf = function schemaLeaf(kind: string): Address {
    return address([API_SEGMENT, SCHEMA_SEGMENT, kind], true);
};

export const contactIndex = function contactIndex(): Address {
    return address([API_SEGMENT, CONTACT_SEGMENT], true);
};

export const localAddress = function localAddress(site: string, target: string): string {
    return target.startsWith(site) ? target.slice(site.length) : target;
};

export const closureReport = function closureReport(): string {
    return absolutePath("govlabHost.reports.content.closure");
};

export const graphReport = function graphReport(): string {
    return absolutePath("govlabHost.reports.content.graph");
};

export const fileOfAddress = function fileOfAddress(path: string): string {
    return path.startsWith(JSON_ROUTE) ? path.slice(1) + JSON_EXTENSION : path.slice(1);
};
