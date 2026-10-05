import { ALGO_FACE, ARCH_FACE, FACE_SEPARATOR, FORCE_FACE, PAG_FACE, REASON_FACE, STAGE_FACE } from "@govlab/constants";
import {
    AXIS_KIND,
    LENS_KIND,
    NODE_KIND,
    TECHNIQUE_KIND,
    TEST_SURFACE_KIND,
} from "#configuration/constants/ontology.constants";
import { type FieldSpec, type GovlabContext, ONTOLOGY_SCHEMA, PAG_KINDS, keywordIdOf, valuesAt } from "@govlab/context";
import type { RefIndex, Resolver, ReverseIndex } from "#types/ontology.types";
import { unreadKind, unresolvableTarget } from "#configuration/strings/ontology.strings";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import { forceNames } from "#core/converters/layer.converter";
import { refOf } from "#core/resolvers/ontology.resolver";

interface Indexed {
    readonly record: unknown;
    readonly self: EdgeRef;
}

interface Scope {
    readonly forces: ReadonlySet<string>;
    readonly resolve: Resolver;
}

type KindRecords = (context: GovlabContext, resolve: Resolver) => readonly Indexed[];

const REASON_PREFIX = REASON_FACE + FACE_SEPARATOR;

const push = function push(index: Map<string, EdgeRef[]>, key: string | null, value: EdgeRef): void {
    if (key === null) {
        return;
    }
    const held = index.get(key) ?? [];
    if (!held.some((entry) => entry.ref === value.ref && entry.label === value.label)) {
        index.set(key, [...held, value]);
    }
};

export const lookup = function lookup(
    index: ReverseIndex,
    relation: string,
    face: string,
    id: string,
): readonly EdgeRef[] {
    return index.get(relation)?.get(refOf(face, id)) ?? [];
};

const kindOf = function kindOf<T>(
    records: (context: GovlabContext) => readonly T[],
    self: (record: T, resolve: Resolver) => EdgeRef,
): KindRecords {
    return (context, resolve) => records(context).map((record) => ({ record, self: self(record, resolve) }));
};

const reasonKind = function reasonKind<T extends { readonly id: string }>(
    kind: string,
    records: (context: GovlabContext) => readonly T[],
): KindRecords {
    return kindOf(records, (record, resolve) => resolve.reasonAs(kind, record.id));
};

const pagSelf = function pagSelf(resolve: Resolver, kind: string, id: string, label: string): EdgeRef {
    return { label, ref: resolve.pag(kind + FACE_SEPARATOR + id).ref };
};

const KIND_RECORDS: ReadonlyMap<string, KindRecords> = new Map([
    [REASON_PREFIX + AXIS_KIND, reasonKind(AXIS_KIND, (context) => context.reason.axes())],
    [REASON_PREFIX + LENS_KIND, reasonKind(LENS_KIND, (context) => context.reason.lenses())],
    [REASON_PREFIX + NODE_KIND, reasonKind(NODE_KIND, (context) => context.reason.nodes())],
    [REASON_PREFIX + TECHNIQUE_KIND, reasonKind(TECHNIQUE_KIND, (context) => context.reason.techniques())],
    [REASON_PREFIX + TEST_SURFACE_KIND, reasonKind(TEST_SURFACE_KIND, (context) => context.reason.testSurfaces())],
    [
        `${REASON_PREFIX}edge`,
        kindOf(
            (context) => context.reason.edges(),
            (edge, resolve) => resolve.edgeSource(edge.from),
        ),
    ],
    [
        `${ALGO_FACE}${FACE_SEPARATOR}contract`,
        kindOf(
            (context) => context.algo.all(),
            (contract, resolve) => resolve.algo(contract.id),
        ),
    ],
    [
        `${ARCH_FACE}${FACE_SEPARATOR}principle`,
        kindOf(
            (context) => context.arch.all(),
            (principle, resolve) => resolve.archId(principle.id),
        ),
    ],
    [
        PAG_FACE + FACE_SEPARATOR + PAG_KINDS.documentType,
        kindOf(
            (context) => context.pag.documentTypes(),
            (type, resolve) => pagSelf(resolve, PAG_KINDS.documentType, type.type, type.type),
        ),
    ],
    [
        PAG_FACE + FACE_SEPARATOR + PAG_KINDS.keyword,
        kindOf(
            (context) => context.pag.keywords(),
            (keyword, resolve) => pagSelf(resolve, PAG_KINDS.keyword, keywordIdOf(keyword), keyword.keyword),
        ),
    ],
    [
        PAG_FACE + FACE_SEPARATOR + PAG_KINDS.production,
        kindOf(
            (context) => context.pag.productions(),
            (production, resolve) => pagSelf(resolve, PAG_KINDS.production, production.lhs, production.lhs),
        ),
    ],
]);

const TARGETS: ReadonlyMap<string, (value: string, scope: Scope) => EdgeRef> = new Map([
    [ALGO_FACE, (value: string, scope: Scope) => scope.resolve.algo(value)],
    [ARCH_FACE, (value: string, scope: Scope) => scope.resolve.arch(value)],
    [STAGE_FACE, (value: string, scope: Scope) => scope.resolve.stage(value)],
    [FORCE_FACE, (value: string, scope: Scope) => scope.resolve.force(value, scope.forces)],
]);

const targetOf = function targetOf(target: string | undefined, value: string, scope: Scope): EdgeRef {
    if (target === undefined) {
        return scope.resolve.target(value);
    }
    if (target.startsWith(REASON_PREFIX)) {
        return scope.resolve.reasonAs(target.slice(REASON_PREFIX.length), value);
    }
    const resolveIn = TARGETS.get(target);
    if (resolveIn === undefined) {
        throw new Error(unresolvableTarget(target));
    }
    return resolveIn(value, scope);
};

const inverseFields = function inverseFields(
    schema: Readonly<Record<string, FieldSpec>>,
): readonly (readonly [string, FieldSpec & { readonly inverse: string }])[] {
    return Object.entries(schema).flatMap(([path, spec]) => {
        const { inverse } = spec;
        return inverse === undefined ? [] : [[path, { ...spec, inverse }] as const];
    });
};

const recordsFor = function recordsFor(kind: string): KindRecords {
    const records = KIND_RECORDS.get(kind);
    if (records === undefined) {
        throw new Error(unreadKind(kind));
    }
    return records;
};

const indexRecord = function indexRecord(
    index: Map<string, Map<string, EdgeRef[]>>,
    fields: ReturnType<typeof inverseFields>,
    indexed: Indexed,
    scope: Scope,
): void {
    for (const [path, spec] of fields) {
        const held = index.get(spec.inverse) ?? new Map<string, EdgeRef[]>();
        index.set(spec.inverse, held);
        for (const value of valuesAt(indexed.record, path)) {
            push(held, targetOf(spec.target, value, scope).ref, indexed.self);
        }
    }
};

export const createReverseIndex = function createReverseIndex(context: GovlabContext, resolve: Resolver): ReverseIndex {
    const scope: Scope = { forces: forceNames(context), resolve };
    const index = new Map<string, Map<string, EdgeRef[]>>();
    for (const [kind, schema] of ONTOLOGY_SCHEMA) {
        const fields = inverseFields(schema);
        const records = fields.length === 0 ? [] : recordsFor(kind)(context, resolve);
        for (const indexed of records) {
            indexRecord(index, fields, indexed, scope);
        }
    }
    return new Map<string, RefIndex>(index);
};
