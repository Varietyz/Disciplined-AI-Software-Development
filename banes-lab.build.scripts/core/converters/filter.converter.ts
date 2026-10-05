import { FACET_FIELDS, KIND_FIELD } from "#configuration/constants/filter.constants";
import { type GovlabContext, slugify } from "@govlab/context";
import type { FacetGroup } from "#types/filter.types";
import type { ReferenceFaces } from "#types/ontology.types";
import { idOf } from "#core/resolvers/ontology.resolver";
import { sharedSlug } from "#configuration/strings/catalog.strings";

const distinct = function distinct(values: readonly string[]): readonly string[] {
    return [...new Set(values.filter((value) => value.trim().length > 0))].sort((a, b) => a.localeCompare(b));
};

export const kindFacetGroups = function kindFacetGroups(collections: ReferenceFaces): readonly FacetGroup[] {
    const declared = new Set(FACET_FIELDS.map((facet) => facet.collection));
    return [...collections.entries()].flatMap(([collection, index]) => {
        if (declared.has(collection)) {
            return [];
        }
        const byKind = new Map<string, string[]>();
        for (const [ref, record] of Object.entries(index)) {
            byKind.set(record.kind, [...(byKind.get(record.kind) ?? []), idOf(ref)]);
        }
        return byKind.size < 2
            ? []
            : distinct([...byKind.keys()]).map((kind) => ({
                  collection,
                  field: KIND_FIELD,
                  ids: byKind.get(kind) ?? [],
                  slug: slugify(kind),
                  value: kind,
              }));
    });
};

export const facetGroups = function facetGroups(context: GovlabContext): readonly FacetGroup[] {
    return FACET_FIELDS.flatMap((facet) => {
        const seen = new Map<string, string>();
        return distinct(facet.values(context)).map((value) => {
            const slug = slugify(value);
            const held = seen.get(slug);
            if (held !== undefined) {
                throw new Error(sharedSlug(facet.collection, facet.field, held, value));
            }
            seen.set(slug, value);
            return {
                collection: facet.collection,
                field: facet.field,
                ids: facet.members(context, value),
                slug,
                value,
            };
        });
    });
};
