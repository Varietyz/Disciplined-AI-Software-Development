import type { CheckFacet } from "#types/check.types";
import type { UnreadKey } from "#types/record.types";

export interface Logger {
    warn: (message: string, detail?: unknown) => void;
}

export interface OntologyIssues {
    duplicateIds: string[];
    danglingEdges: { from: string; relation: string; target: string }[];
}

export interface Edge {
    relation: string;
    targets: string[];
}

export interface Ontology<R> {
    get: (id: string) => R | null;
    all: () => R[];
    ids: () => string[];
    query: (matcher: (record: R) => boolean) => R[];
    index: () => ReadonlyMap<string, R>;
    validateOntology: (edgesOf: (record: R) => Edge[], resolveId?: (target: string) => string) => OntologyIssues;
}

export interface OntologyOptions<R> {
    records: readonly R[];
    idOf: (record: R) => string;
    label: string;
    logger?: Logger | undefined;
}

export interface OntologyAudit {
    attributions: () => string[];
    unread: () => UnreadKey[];
}

export interface BaseFaceConfig<R, F> {
    audit: OntologyAudit;
    idOf: (record: R) => string;
    label: string;
    matches: (record: R, filter: F) => boolean;
    logger?: Logger | undefined;
}

export interface FaceContext {
    logger?: Logger | undefined;
    canonicalizeId?: ((term: string) => string) | undefined;
}

export interface OntologyFaceDefinition<P = unknown> {
    name: string;
    dependsOn?: readonly string[];
    build: (context: FaceContext, dependencies: Record<string, unknown>) => P;
}

export interface JsonDirOptions {
    only?: (name: string) => boolean;
    exclude?: (name: string) => boolean;
}

export type Normalizer<R> = (
    raw: Record<string, unknown>,
    category: string,
    declared: CheckFacet | null,
    group: Record<string, unknown>,
) => R;
