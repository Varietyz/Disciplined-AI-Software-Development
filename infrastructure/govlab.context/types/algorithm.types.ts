import type { DistinctDeclaration, Exemplar } from "#types/field.types";
import type { CheckFacet } from "#types/check.types";
import type { DOMAIN_TIER_VOCABULARY } from "#configuration/constants/algorithm.constants";
import type { Logger } from "#types/ontology.types";
import type { UnreadKey } from "#types/record.types";

export type DomainTier = (typeof DOMAIN_TIER_VOCABULARY)[number]["value"];

export interface Production {
    lhs: string;
    rhs: string;
}

export interface DerivationMapEntry {
    stage: string;
    record: string;
}

export interface ContractRecord {
    id: string;
    title: string;
    aliases?: string[];
    intent: string;
    invariant: string;
    flow: string[];
    productions: Production[];
    composes: string[];
    force: string[];
    grounds?: string[];
    principleRef?: string;
    meta?: boolean;
    exemplar?: Exemplar;
    stage?: string;
    axis?: string;
    mathType?: string;
    yields?: string;
    derivationMap?: DerivationMapEntry[];
    distinctFrom?: DistinctDeclaration[];
    check?: CheckFacet;
    canon?: string[];
}

export interface ContractCategory {
    category: string;
    records: ContractRecord[];
    tier: DomainTier;
}

export interface Contract extends ContractRecord {
    domain: string;
    tier: DomainTier;
}

export interface SymbolEntry {
    grammar: string;
    name: string;
    kind: "composite" | "enum";
    values?: string[];
    rhs?: string;
    definedIn: string[];
}

export interface SymbolFile {
    symbols: SymbolEntry[];
}

export interface ContractSymbolView {
    domain: string;
    id: string;
    productions: readonly { lhs: string; rhs: string }[];
}

export interface AlgoGrammarOptions {
    logger?: Logger | undefined;
    data?: ContractCategory[];
    symbols?: SymbolEntry[];
}

export interface ContractFilter {
    domain?: string;
    force?: string;
    composes?: string;
    meta?: boolean;
}

export interface ClosureResult {
    seed: string[];
    closure: Contract[];
    order: string[];
}

export interface Cluster {
    force: string;
    core: string[];
    supporting: string[];
}

export interface ConcernJoinRow {
    force: string;
    contracts: string[];
    concerns: string[];
    principles: string[];
}

export interface ConcernResolvers {
    concernsForForce?: (force: string) => string[];
    principlesForForce?: (force: string) => string[];
}

export interface ContractIssues {
    duplicateIds: string[];
    danglingComposes: { from: string; target: string }[];
}

export interface AlgoGrammar {
    attributions: () => string[];
    get: (id: string) => Contract | null;
    all: () => Contract[];
    ids: () => string[];
    symbols: () => SymbolEntry[];
    query: (filter?: ContractFilter) => Contract[];
    byForce: (force: string) => Contract[];
    resolveClosure: (ids: string[]) => ClosureResult;
    cluster: () => Cluster[];
    joinConcerns: (resolvers?: ConcernResolvers) => ConcernJoinRow[];
    unreadKeys: () => UnreadKey[];
    validateOntology: () => ContractIssues;
}
