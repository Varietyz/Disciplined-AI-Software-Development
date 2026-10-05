import { API_PREFIX, INDEX_KIND } from "#configuration/constants/catalog.constants";
import type { Address, Identity } from "#types/catalog.types";
import {
    COLLECTION_TITLES,
    facetCollectionTitle,
    facetFieldTitle,
    facetTitle,
    recordCountPhrase,
} from "@banes-lab/web/strings/catalog.strings";
import {
    FACETS_INDEX_TITLE,
    PAGES_INDEX_TITLE,
    RECORDS_INDEX_TITLE,
    SOURCES_INDEX_TITLE,
    untitledCollection,
} from "#configuration/strings/catalog.strings";
import type { FacetLevels, IndexPlan, LevelMembers } from "#types/index.types";
import {
    collectionIndex,
    facetCollectionIndex,
    facetFieldIndex,
    facetLeaf,
    facetsIndex,
    pagesIndex,
    recordsIndex,
    sourcesIndex,
} from "#core/resolvers/catalog.resolver";
import type { FacetGroup } from "#types/filter.types";
import { groupedBy } from "#core/converters/base.converter";
import { refOf } from "#core/resolvers/ontology.resolver";

const SLASH = "/";
const RECORDS_PATH = "records/";
const FACETS_PATH = "facets/";
const SOURCE_PATH = "source/";
const PAGES_PATH = "pages";

const collectionTitle = function collectionTitle(collection: string): string {
    const title = COLLECTION_TITLES.get(collection);
    if (title === undefined) {
        throw new Error(untitledCollection(collection));
    }
    return title;
};

const facetIdentity = function facetIdentity(group: FacetGroup): Identity {
    return {
        address: facetLeaf(group.collection, group.field, group.slug),
        href: null,
        kind: INDEX_KIND,
        ref: API_PREFIX + FACETS_PATH + [group.collection, group.field, group.slug].join(SLASH),
        summary: recordCountPhrase(group.ids.length),
        title: facetTitle(collectionTitle(group.collection), group.field, group.value),
    };
};

export const facetIndexPlans = function facetIndexPlans(groups: readonly FacetGroup[]): readonly IndexPlan[] {
    return groups.map((group) => {
        const identity = facetIdentity(group);
        const data = {
            collection: group.collection,
            field: group.field,
            ref: identity.ref,
            title: identity.title,
            value: group.value,
        };
        return { data, identity, refs: group.ids.map((id) => refOf(group.collection, id)) };
    });
};

export const collectionIndexPlans = function collectionIndexPlans(
    collections: ReadonlyMap<string, readonly string[]>,
    groups: readonly FacetGroup[],
    site: string,
): readonly IndexPlan[] {
    return [...collections.entries()].map(([collection, refs]) => {
        const facets = groups
            .filter((group) => group.collection === collection)
            .map((group) => ({
                count: group.ids.length,
                field: group.field,
                json: site + facetIdentity(group).address.json,
                markdown: site + (facetIdentity(group).address.markdown ?? ""),
                slug: group.slug,
                value: group.value,
            }));
        const identity: Identity = {
            address: collectionIndex(collection),
            href: null,
            kind: INDEX_KIND,
            ref: API_PREFIX + RECORDS_PATH + collection,
            summary: recordCountPhrase(refs.length),
            title: collectionTitle(collection),
        };
        const data = { collection, facets, ref: identity.ref, title: identity.title };
        return { data, identity, refs };
    });
};

const levelPlan = function levelPlan(
    address: Address,
    ref: string,
    title: string,
    members: readonly IndexPlan[],
): IndexPlan {
    const identity: Identity = { address, href: null, kind: INDEX_KIND, ref, summary: null, title };
    const data = { ref, title };
    return { data, identity, refs: members.map((member) => member.identity.ref) };
};

export const levelIndexPlans = function levelIndexPlans(members: LevelMembers): readonly IndexPlan[] {
    return [
        levelPlan(pagesIndex(), API_PREFIX + PAGES_PATH, PAGES_INDEX_TITLE, members.pages),
        levelPlan(recordsIndex(), API_PREFIX + RECORDS_PATH.slice(0, -1), RECORDS_INDEX_TITLE, members.collections),
        levelPlan(sourcesIndex(), API_PREFIX + SOURCE_PATH.slice(0, -1), SOURCES_INDEX_TITLE, members.trees),
        levelPlan(facetsIndex(), API_PREFIX + FACETS_PATH.slice(0, -1), FACETS_INDEX_TITLE, members.facets),
    ];
};

export const facetLevelPlans = function facetLevelPlans(groups: readonly FacetGroup[]): FacetLevels {
    const byCollection = groupedBy(groups, (group) => group.collection);
    const fields: IndexPlan[] = [];
    const collections = [...byCollection.entries()].map(([collection, held]) => {
        const title = collectionTitle(collection);
        const fieldPlans = [...groupedBy(held, (group) => group.field).entries()].map(([field, values]) => {
            const ref = API_PREFIX + FACETS_PATH + collection + SLASH + field;
            const plan = levelPlan(facetFieldIndex(collection, field), ref, facetFieldTitle(title, field), []);
            return { ...plan, refs: values.map((group) => facetIdentity(group).ref) };
        });
        fields.push(...fieldPlans);
        const ref = API_PREFIX + FACETS_PATH + collection;
        return levelPlan(facetCollectionIndex(collection), ref, facetCollectionTitle(title), fieldPlans);
    });
    return { collections, fields };
};
