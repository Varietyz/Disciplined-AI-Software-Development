import { CATALOG_VERSION, QUERY_REFS, RESOLVE_PREFIX } from "#configuration/constants/catalog.constants";
import type { CatalogClose, IndexPlan } from "#types/index.types";
import type { CatalogStore, Entry, SiteParts } from "#types/catalog.types";
import { idsLeaves, siteBuildOf, siteLeaf } from "#core/converters/catalog.converter";
import { indexLeaves, isIndexHead } from "#core/converters/index.converter";
import { inferredKindOf, samplesOf, schemaLeaves } from "#core/converters/schema.converter";
import { localAddress, schemaLeaf, siteIndex } from "#core/resolvers/catalog.resolver";
import { movedLeaf, updateJournal } from "#core/converters/journal.converter";
import type { Journal } from "#types/journal.types";
import { documentPages } from "#core/converters/section.converter";
import { latestStamp } from "#core/converters/route.converter";
import { ledgerFile } from "#core/resolvers/route.resolver";
import { readLedger } from "#core/persistence/route.persistence";

const DOCUMENT_REF_PREFIX = "api:/";

const isListed = function isListed(entry: Entry): boolean {
    return !entry.ref.startsWith(RESOLVE_PREFIX);
};

const addIndexes = function addIndexes(store: CatalogStore, close: CatalogClose): Omit<SiteParts, "queries"> {
    const { indexes } = close;
    const { site } = close.discovery;
    store.add(indexLeaves(indexes.tabs, store.entries, site));
    const pageRefs = new Set(indexes.pages.map((plan) => plan.identity.ref));
    const listsPages = (plan: IndexPlan): boolean => plan.refs.some((ref) => pageRefs.has(ref));
    const pages = [
        ...store.add(
            indexLeaves(
                indexes.pages.filter((plan) => !listsPages(plan)),
                store.entries,
                site,
            ),
        ),
        ...store.add(indexLeaves(indexes.pages.filter(listsPages), store.entries, site)),
    ].filter(isIndexHead);
    store.add(indexLeaves(indexes.facets, store.entries, site));
    store.add(indexLeaves(indexes.facetFields, store.entries, site));
    store.add(indexLeaves(indexes.facetCollections, store.entries, site));
    const collections = store.add(indexLeaves(indexes.collections, store.entries, site)).filter(isIndexHead);
    for (const folder of indexes.folders.toReversed()) {
        store.add(indexLeaves([folder], store.entries, site));
    }
    const trees = store.add(indexLeaves(indexes.trees, store.entries, site)).filter(isIndexHead);
    store.add(indexLeaves(indexes.levels, store.entries, site));
    const documentRefs = new Set(documentPages(close.discovery).map((page) => DOCUMENT_REF_PREFIX + page.id));
    return {
        collections,
        documents: pages.filter((entry) => documentRefs.has(entry.ref)),
        pages: pages.filter((entry) => !documentRefs.has(entry.ref)),
        trees,
    };
};

export const closeCatalog = function closeCatalog(store: CatalogStore, close: CatalogClose): Journal {
    const { discovery } = close;
    const { site } = discovery;
    const listed = addIndexes(store, close);
    const journal = updateJournal(close.journal, [...store.entries.values()].filter(isListed), site);
    store.add([movedLeaf(journal, site)]);
    const ledger = readLedger(ledgerFile());
    const parts = (ids: readonly Entry[]): SiteParts => ({
        ...listed,
        queries: [...close.queries, ...ids].filter((entry) => QUERY_REFS.has(entry.ref)),
    });
    const draftIds = idsLeaves([...store.entries.values()].filter(isListed), site);
    const entryAddresses = [...store.entries.values()].map((entry) => localAddress(site, entry.json));
    const idsAddresses = draftIds.map((leaf) => leaf.identity.address.json);
    const kinds = new Set([...entryAddresses, ...idsAddresses, siteIndex().json].map(inferredKindOf));
    const schemaAddresses = [...kinds].flatMap((kind) => (kind === null ? [] : [schemaLeaf(kind).json]));
    const published = [...entryAddresses, ...schemaAddresses, ...idsAddresses];
    const draftBuild = { build: "", published, updated: latestStamp(ledger), version: CATALOG_VERSION };
    const drafts = [...draftIds, siteLeaf(discovery, parts([]), draftBuild)];
    store.add(schemaLeaves(samplesOf(store.files, drafts), site));
    const ids = store.add(idsLeaves([...store.entries.values()].filter(isListed), site));
    const build = siteBuildOf([...store.entries.values()], ledger, site);
    store.add([siteLeaf(discovery, parts(ids), build)]);
    return journal;
};
