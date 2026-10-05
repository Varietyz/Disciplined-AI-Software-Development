import { CATALOG_FILE_BUDGET, INDEX_PART_BUDGET, INDEX_PART_KIND } from "#configuration/constants/catalog.constants";
import type { Entries, IndexPart, IndexPlan, IndexPlans, IndexScope } from "#types/index.types";
import type { Entry, Identity, Leaf } from "#types/catalog.types";
import {
    collectionIndexPlans,
    facetIndexPlans,
    facetLevelPlans,
    levelIndexPlans,
} from "#core/converters/index.filter.converter";
import { emptyIndex, indexPartTitle } from "#configuration/strings/catalog.strings";
import { packedParts, serialize } from "#core/stores/catalog.store";
import { pageIndexPlans, tabIndexPlans } from "#core/converters/index.page.converter";
import { Buffer } from "node:buffer";
import { indexPart } from "#core/resolvers/catalog.resolver";
import { renderIndex } from "#core/formatters/index.formatter";
import { sourceIndexPlans } from "#core/converters/index.source.converter";

const PART_REF_MARK = "/";

export const indexPlansOf = function indexPlansOf(scope: IndexScope): IndexPlans {
    const collectionRefs = new Map(
        [...scope.collections.entries()].map(([collection, index]) => [collection, Object.keys(index)]),
    );
    const collections = collectionIndexPlans(collectionRefs, scope.groups, scope.site);
    const pages = pageIndexPlans(scope.discovery, scope.plans);
    const source = sourceIndexPlans(scope.files, scope.localPath);
    const facetLevels = facetLevelPlans(scope.groups);
    return {
        collections,
        facetCollections: facetLevels.collections,
        facetFields: facetLevels.fields,
        facets: facetIndexPlans(scope.groups),
        folders: source.folders,
        levels: levelIndexPlans({ collections, facets: facetLevels.collections, pages, trees: source.trees }),
        pages,
        tabs: tabIndexPlans(scope.discovery, scope.plans),
        trees: source.trees,
    };
};

const entriesOf = function entriesOf(entries: Entries, refs: readonly string[]): readonly Entry[] {
    return refs.flatMap((ref) => {
        const entry = entries.get(ref);
        return entry === undefined ? [] : [entry];
    });
};

const partLeaves = function partLeaves(plan: IndexPlan, listed: readonly Entry[], site: string): readonly Leaf[] {
    const parts = packedParts(listed, INDEX_PART_BUDGET);
    const leaves = parts.map((entries, index): Leaf => {
        const part = index + 1;
        const title = indexPartTitle(plan.identity.title, part, parts.length);
        const identity: Identity = {
            address: indexPart(plan.identity.address, String(part)),
            href: null,
            kind: INDEX_PART_KIND,
            ref: plan.identity.ref + PART_REF_MARK + String(part),
            summary: null,
            title,
        };
        const data = { entries, part, ref: identity.ref, title, total: parts.length };
        return { data, identity, markdown: renderIndex(identity, { ref: identity.ref, title }, entries, site) };
    });
    const summaries = leaves.map((leaf, index): IndexPart => ({
        count: parts[index]?.length ?? 0,
        first: parts[index]?.at(0)?.title ?? "",
        json: site + leaf.identity.address.json,
        last: parts[index]?.at(-1)?.title ?? "",
        markdown: leaf.identity.address.markdown === null ? null : site + leaf.identity.address.markdown,
    }));
    const data = { ...plan.data, count: listed.length, parts: summaries };
    return [...leaves, { data, identity: plan.identity, markdown: renderIndex(plan.identity, data, [], site) }];
};

export const indexLeaves = function indexLeaves(
    plans: readonly IndexPlan[],
    entries: Entries,
    site: string,
): readonly Leaf[] {
    return plans.flatMap((plan) => {
        const listed = entriesOf(entries, plan.refs);
        if (listed.length === 0) {
            throw new Error(emptyIndex(plan.identity.ref));
        }
        const data = { ...plan.data, entries: listed };
        if (Buffer.byteLength(serialize(data)) > CATALOG_FILE_BUDGET) {
            return partLeaves(plan, listed, site);
        }
        return [{ data, identity: plan.identity, markdown: renderIndex(plan.identity, plan.data, listed, site) }];
    });
};

export const isIndexHead = function isIndexHead(entry: Entry): boolean {
    return entry.kind !== INDEX_PART_KIND;
};
