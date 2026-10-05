import { createArchRelations, createLexicon, slugify } from "@govlab/context";
import { KIND_SET } from "#configuration/constants/canon.constants";
import { loadKindMap } from "#core/loaders/kind.loader";

const KIND_LOOKUP: ReadonlySet<string> = new Set(KIND_SET);
const KIND_MAP = loadKindMap();
const PAREN_OPEN = "(";
const PAREN_CLOSE = ")";

const ALIAS_IDS: ReadonlyMap<string, string> = new Map(
    [...createArchRelations().all(), ...createLexicon().all()].flatMap((record) =>
        (record.aliases ?? []).map((alias): [string, string] => [slugify(alias), record.id]),
    ),
);

const withoutAcronym = function withoutAcronym(term: string): string {
    const open = term.lastIndexOf(PAREN_OPEN);
    const close = term.lastIndexOf(PAREN_CLOSE);
    return open !== -1 && close > open ? `${term.slice(0, open)}${term.slice(close + 1)}`.trim() : term;
};

export const canonicalizeId = function canonicalizeId(term: string): string {
    const plain = slugify(withoutAcronym(term));
    return ALIAS_IDS.get(slugify(term)) ?? ALIAS_IDS.get(plain) ?? plain;
};

export const isCanonicalId = function isCanonicalId(term: string): boolean {
    return canonicalizeId(term) === term;
};

export const canonicalizeKind = function canonicalizeKind(type: string): string | null {
    return KIND_MAP.get(type) ?? null;
};

export const isCanonicalKind = function isCanonicalKind(kind: string): boolean {
    return KIND_LOOKUP.has(kind);
};
