import type { CHECK_QUESTIONS } from "#configuration/constants/check.constants";

export type CheckQuestion = (typeof CHECK_QUESTIONS)[number];

export type CheckAnswers = Partial<Record<CheckQuestion, string>>;

export interface CheckFacet extends CheckAnswers {
    by?: string[];
}

export interface CheckedRecord {
    by: readonly string[];
    collection: string;
    dependsOn: readonly string[];
    facet: CheckFacet | null;
    id: string;
    ownBy: readonly string[];
    shape: readonly string[];
}

export interface UncheckedRecord {
    collection: string;
    id: string;
    missing: string[];
}

export interface UnresolvedCheckRef {
    collection: string;
    field: string;
    id: string;
    ref: string;
}

export interface SecondCheckHome {
    collection: string;
    id: string;
    home: string;
}

export interface QuestionCoverage {
    answered: number;
    declaredAbsent: number;
    question: string;
}

export interface CollectionCoverage {
    collection: string;
    questions: QuestionCoverage[];
    records: number;
}

export interface CheckDeclaration {
    readonly detects: readonly string[];
    readonly enforces: readonly string[];
}

export interface DeclaredCheck extends CheckDeclaration {
    readonly check: string;
}

export type DeclarationField = keyof CheckDeclaration;

export interface CheckDeclarationDefect {
    check: string;
    field: DeclarationField;
    ref: string;
    resolved: boolean;
}

export interface CheckGaps {
    checkDeclarationDefects: CheckDeclarationDefect[];
    collections: CollectionCoverage[];
    uncoveredCollections: string[];
    secondCheckHomes: SecondCheckHome[];
    unreachedByPropagation: string[];
    uncheckedRecords: UncheckedRecord[];
    unresolvedCheckRefs: UnresolvedCheckRef[];
}

export interface CheckResolver {
    collections: ReadonlySet<string>;
    resolve: (ref: string) => boolean;
}
