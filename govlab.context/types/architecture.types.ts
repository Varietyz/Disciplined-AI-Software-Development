import type { DistinctDeclaration, Exemplar } from "#types/field.types";
import type { Logger, OntologyIssues } from "#types/ontology.types";
import type { CheckFacet } from "#types/check.types";
import type { SEVERITY_TAXONOMY } from "#configuration/constants/architecture.constants";
import type { UnreadKey } from "#types/record.types";

export type SeverityLevel = (typeof SEVERITY_TAXONOMY)[number]["value"];

export type EdgeRelation = "conflicts_with" | "enables" | "reinforces" | "requires" | "tensions_with";

export type RepairField = "refactored_by" | "violated_by";

export interface PrincipleRecord {
    id?: string;
    name: string;
    definition: string;
    type: string;
    aliases?: string[];
    scope: string[];
    requires: string[];
    reinforces: string[];
    enables: string[];
    conflicts_with: string[];
    tensions_with: string[];
    violated_by?: string[];
    formed_by?: string;
    detected_by: string[];
    measured_by: string[];
    refactored_by: string[];
    enforced_by: string[];
    severity: SeverityLevel;
    mandatoryFor?: string;
    exemplar?: Exemplar;
    check?: CheckFacet;
    canon?: string[];
    distinctFrom?: DistinctDeclaration[];
    expressedBy?: string[];
}

export interface PrincipleCategory {
    category: string;
    records: PrincipleRecord[];
}

export interface Principle extends PrincipleRecord {
    id: string;
    category: string;
}

export interface ArchRelationsOptions {
    logger?: Logger | undefined;
    data?: PrincipleCategory[];
    canonicalizeId?: ((term: string) => string) | undefined;
}

export interface PrincipleFilter {
    type?: string;
    scope?: string;
    category?: string;
    severity?: string;
    enables?: string;
    requires?: string;
    reinforces?: string;
    conflictsWith?: string;
    tensionsWith?: string;
}

export type PrincipleEdge = Principle | string;

export interface ResolveResult {
    principles: Principle[];
    edges: {
        requires: PrincipleEdge[];
        reinforces: PrincipleEdge[];
        enables: PrincipleEdge[];
        conflictsWith: PrincipleEdge[];
        tensionsWith: PrincipleEdge[];
    };
    refactorRecipes: { id: string; refactoredBy: string[]; detectedBy: string[]; violatedBy: string[] }[];
}

export interface ArchRelations {
    get: (id: string) => Principle | null;
    all: () => Principle[];
    ids: () => string[];
    query: (filter?: PrincipleFilter) => Principle[];
    resolve: (ids: string[]) => ResolveResult;
    unreadKeys: () => UnreadKey[];
    validateOntology: () => OntologyIssues;
}

export interface KindDefinition {
    kind: string;
    discriminator: string;
    distinguishesFrom: string;
    definitionSignatures: string[];
}
