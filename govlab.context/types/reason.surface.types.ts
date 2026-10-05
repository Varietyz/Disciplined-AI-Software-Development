import type {
    EVIDENCE_SOURCE_VOCABULARY,
    PREDICATE_TYPE_VOCABULARY,
    VERDICT_VOCABULARY,
} from "#configuration/constants/reason.constants";

export type Verdict = (typeof VERDICT_VOCABULARY)[number]["value"];

export type EvidenceSource = (typeof EVIDENCE_SOURCE_VOCABULARY)[number]["value"];

export type PredicateType = (typeof PREDICATE_TYPE_VOCABULARY)[number]["value"];

export interface TestSurfacePredicate {
    type: PredicateType;
    expression: string;
    grounds?: string[];
}

export interface TestSurfaceEvidence {
    required: boolean;
    source: EvidenceSource;
    grounds?: string[];
}

export interface TestSurface {
    id: string;
    dimension: string;
    lens: string;
    fit: string;
    failureModes: string[];
    techniques: string[];
    predicate: TestSurfacePredicate;
    invariant: string;
    evidence: TestSurfaceEvidence;
    verdictDomain: Verdict[];
    aliases?: string[];
}

export interface Technique {
    id: string;
    mode: string;
    principle: string;
    principleRef?: string;
    fails: string;
    aliases?: string[];
}

export interface Invariant {
    id: string;
    name: string;
    statement: string;
    aliases?: string[];
}

export interface FailureShape {
    id: string;
    name: string;
    shape: string;
    fix: string;
    breaks: string;
    canon: string[];
    instances: string[];
    aliases?: string[];
}
