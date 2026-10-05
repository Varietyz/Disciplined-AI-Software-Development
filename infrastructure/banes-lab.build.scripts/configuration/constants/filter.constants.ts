import { ALGO_FACE, ARCH_FACE, LEX_FACE } from "@govlab/constants";
import type { FacetField } from "#types/filter.types";

const TRUE = "true";
const FALSE = "false";

const idsOf = function idsOf(records: readonly { readonly id: string }[]): readonly string[] {
    return records.map((record) => record.id);
};

export const KIND_FIELD = "kind";

export const FACET_FIELDS: readonly FacetField[] = [
    {
        collection: ARCH_FACE,
        field: "type",
        members: (context, value) => idsOf(context.arch.query({ type: value })),
        values: (context) => context.arch.all().map((principle) => principle.type),
    },
    {
        collection: ARCH_FACE,
        field: "category",
        members: (context, value) => idsOf(context.arch.query({ category: value })),
        values: (context) => context.arch.all().map((principle) => principle.category),
    },
    {
        collection: ARCH_FACE,
        field: "severity",
        members: (context, value) => idsOf(context.arch.query({ severity: value })),
        values: (context) => context.arch.all().map((principle) => principle.severity),
    },
    {
        collection: ARCH_FACE,
        field: "scope",
        members: (context, value) => idsOf(context.arch.query({ scope: value })),
        values: (context) => context.arch.all().flatMap((principle) => principle.scope),
    },
    {
        collection: LEX_FACE,
        field: "kind",
        members: (context, value) => idsOf(context.lex.query({ kind: value })),
        values: (context) => context.lex.all().map((term) => term.kind),
    },
    {
        collection: LEX_FACE,
        field: "category",
        members: (context, value) => idsOf(context.lex.query({ category: value })),
        values: (context) => context.lex.all().map((term) => term.category),
    },
    {
        collection: LEX_FACE,
        field: "enforcedBy",
        members: (context, value) => idsOf(context.lex.query({ enforcedBy: value })),
        values: (context) => context.lex.all().flatMap((term) => term.enforcedBy),
    },
    {
        collection: ALGO_FACE,
        field: "domain",
        members: (context, value) => idsOf(context.algo.query({ domain: value })),
        values: (context) => context.algo.all().map((contract) => contract.domain),
    },
    {
        collection: ALGO_FACE,
        field: "force",
        members: (context, value) => idsOf(context.algo.query({ force: value })),
        values: (context) => context.algo.all().flatMap((contract) => contract.force),
    },
    {
        collection: ALGO_FACE,
        field: "meta",
        members: (context, value) => idsOf(context.algo.query({ meta: value === TRUE })),
        values: (context) => context.algo.all().map((contract) => (contract.meta === true ? TRUE : FALSE)),
    },
];
