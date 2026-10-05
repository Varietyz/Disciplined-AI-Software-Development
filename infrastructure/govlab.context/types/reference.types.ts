import type { PagGrammar } from "#types/grammar.types";

export type KindMembers = ReadonlyMap<string, ReadonlySet<string>>;

export type PagTargets = Pick<PagGrammar, "documentType" | "keyword" | "production" | "template">;

export interface TargetResolverFaces {
    algo: { get: (id: string) => unknown };
    arch?: { get: (id: string) => unknown };
    lex?: { resolve: (id: string) => unknown };
    pag?: PagTargets;
}

export interface IdRecord {
    id: string;
}

export interface AlgoContractView {
    domain: string;
    grounds?: readonly string[];
    id: string;
}

export interface ReasonKindFaces {
    reason: { axes: () => IdRecord[]; kindMembers: () => KindMembers; models: () => IdRecord[] };
}

export type CollectionRefFaces = TargetResolverFaces & {
    reason: ReasonKindFaces["reason"] & { resolve: (id: string) => unknown };
};

export interface PagGroundingFaces extends ReasonKindFaces {
    pag: Pick<PagGrammar, "documentTypes" | "keywords" | "productions">;
}

export interface GrammarGroundingFaces {
    algo: { all: () => AlgoContractView[] };
    reason: { resolve: (id: string) => unknown; kindMembers: () => KindMembers };
}

export interface ReasonRef {
    kind: string;
    id: string;
}
