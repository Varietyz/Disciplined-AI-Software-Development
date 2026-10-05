import type { DistinctView, EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { Exemplar } from "@govlab/context";
import type { ExemplarView } from "@banes-lab/web/types/ontology.types.js";
import type { OntologySources } from "#types/ontology.types";

export const orNull = function orNull(value?: string): string | null {
    return value === undefined || value.length === 0 ? null : value;
};

export const exemplarOf = function exemplarOf(exemplar?: Exemplar): ExemplarView | null {
    return exemplar === undefined ? null : { ...exemplar };
};

export const groupBy = function groupBy<T>(items: readonly T[], keyOf: (item: T) => string): readonly [string, T[]][] {
    const groups = new Map<string, T[]>();
    for (const item of items) {
        const key = keyOf(item);
        groups.set(key, [...(groups.get(key) ?? []), item]);
    }
    return [...groups.entries()];
};

export const layerRef = function layerRef(sources: OntologySources, id: string): EdgeRef | null {
    const layer = sources.context.layerOf(id);
    return layer === null ? null : sources.resolve.layer(layer);
};

export const distinctsOf = function distinctsOf(
    declared: readonly { readonly id: string; readonly reason: string }[] | undefined,
    resolveId: (id: string) => EdgeRef,
): readonly DistinctView[] {
    return (declared ?? []).map((entry) => ({ reason: entry.reason, record: resolveId(entry.id) }));
};
