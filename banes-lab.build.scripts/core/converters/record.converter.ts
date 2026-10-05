import { ALGO_FACE, ARCH_FACE, LEX_FACE, REFERENCED_BY_RELATION } from "@govlab/constants";
import { EVIDENCE_RELATION_ID, LINKED_FROM_RELATION } from "@banes-lab/web/constants/graph.constants";
import type { Identity, Leaf, Link, Linker, Relation } from "#types/catalog.types";
import type { ReferenceRecord, ReferenceRelation } from "@banes-lab/web/types/reference.types.js";
import { closureLeaf, recordLeaf } from "#core/resolvers/catalog.resolver";
import { idOf, refOf } from "#core/resolvers/ontology.resolver";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { GovlabContext } from "@govlab/context";
import type { RecordSources } from "#types/record.types";
import type { ReferenceFaces } from "#types/ontology.types";
import { closureTitle } from "#configuration/strings/catalog.strings";
import { placedOf } from "#core/converters/location.converter";
import { relationGroups } from "#core/converters/link.converter";
import { renderRecordLeaf } from "#core/formatters/record.formatter";

const CLOSURE_KIND = "closure";

const titleOf = function titleOf(record: ReferenceRecord): string {
    return record.code === null ? record.name : `${record.name} (${record.code})`;
};

export const recordIdentities = function recordIdentities(
    collections: ReferenceFaces,
    hrefOf: (ref: string) => string | null,
): readonly Identity[] {
    return [...collections.entries()].flatMap(([collection, index]) =>
        Object.entries(index).map(([ref, record]) => ({
            address: recordLeaf(collection, idOf(ref)),
            href: hrefOf(ref),
            kind: record.kind,
            ref,
            summary: record.summary,
            title: titleOf(record),
        })),
    );
};

const withInbound = function withInbound(
    forward: readonly ReferenceRelation[],
    inbound: readonly ReferenceRelation[],
): readonly ReferenceRelation[] {
    const stored = forward.filter((relation) => relation.relation !== REFERENCED_BY_RELATION);
    const listed = new Set(stored.flatMap((relation) => relation.edges.map((edge) => edge.ref)));
    const fresh = new Map<string, readonly EdgeRef[]>();
    for (const relation of inbound) {
        const unlisted = relation.edges.filter((edge) => !listed.has(edge.ref));
        fresh.set(relation.relation, [...(fresh.get(relation.relation) ?? []), ...unlisted]);
    }
    const merged = stored.map((relation) => ({
        ...relation,
        edges: [...relation.edges, ...(fresh.get(relation.relation) ?? [])],
    }));
    const names = new Set(stored.map((relation) => relation.relation));
    const added = [...fresh.entries()]
        .filter(([relation, edges]) => !names.has(relation) && edges.length > 0)
        .map(([relation, edges]) => ({ edges, relation }));
    return [...merged, ...added];
};

export const relationNamesOf = function relationNamesOf(
    collections: ReferenceFaces,
    inbound: RecordSources["inbound"],
): readonly string[] {
    return [...collections.values()].flatMap((index) =>
        Object.entries(index).flatMap(([ref, record]) =>
            withInbound(record.relations, inbound(ref)).map((relation) => relation.relation),
        ),
    );
};

const linksOf = function linksOf(linker: Linker, edges: readonly EdgeRef[]): readonly Link[] {
    return edges.map((edge) => linker.link(edge.label, edge.ref));
};

const archExtras = function archExtras(sources: RecordSources, id: string): object {
    const principle = sources.context.arch.get(id);
    if (principle === null) {
        return {};
    }
    return {
        aliases: principle.aliases ?? [],
        exemplar: principle.exemplar ?? null,
        formedBy: principle.formed_by ?? null,
        scope: principle.scope,
        severity: principle.severity,
    };
};

const extrasOf = function extrasOf(sources: RecordSources, collection: string, id: string): object {
    if (collection === ARCH_FACE) {
        return archExtras(sources, id);
    }
    if (collection === LEX_FACE) {
        return { aliases: sources.context.lex.get(id)?.aliases ?? [] };
    }
    return collection === ALGO_FACE ? { closure: sources.linker.site + closureLeaf(collection, id).json } : {};
};

export const recordLeaves = function recordLeaves(
    collections: ReferenceFaces,
    sources: RecordSources,
): readonly Leaf[] {
    const { linker } = sources;
    return [...collections.entries()].flatMap(([collection, index]) =>
        Object.entries(index).flatMap(([ref, record]) => {
            const identity = linker.byRef(ref);
            if (identity === null) {
                return [];
            }
            const relations: readonly Relation[] = relationGroups([
                ...withInbound(record.relations, sources.inbound(ref)).map((relation) => ({
                    links: linksOf(linker, relation.edges),
                    relation: relation.relation,
                })),
                { links: sources.linkedBy(ref), relation: LINKED_FROM_RELATION },
                { links: sources.evidence(ref), relation: EVIDENCE_RELATION_ID },
            ]);
            const data = {
                code: record.code,
                collection,
                href: identity.href === null ? null : linker.site + identity.href,
                id: idOf(ref),
                kind: record.kind,
                layer: record.layer === null ? null : linker.link(record.layer.label, record.layer.ref),
                name: record.name,
                ref,
                relations,
                summary: record.summary,
                ...placedOf(sources.placement(ref)),
                ...extrasOf(sources, collection, idOf(ref)),
            };
            return [{ data, identity, markdown: renderRecordLeaf(data) }];
        }),
    );
};

export const closureLeaves = function closureLeaves(context: GovlabContext, linker: Linker): readonly Leaf[] {
    return context.algo.all().map((contract) => {
        const ref = refOf(ALGO_FACE, contract.id);
        const closure = context.algo.resolveClosure([contract.id]);
        const order = closure.order.map((id) => linker.link(context.algo.get(id)?.title ?? id, refOf(ALGO_FACE, id)));
        const title = closureTitle(contract.title);
        const identity: Identity = {
            address: closureLeaf(ALGO_FACE, contract.id),
            href: null,
            kind: CLOSURE_KIND,
            ref: `${ref}/${CLOSURE_KIND}`,
            summary: null,
            title,
        };
        return {
            data: { order, record: linker.link(contract.title, ref), ref: identity.ref, title },
            identity,
            markdown: null,
        };
    });
};
